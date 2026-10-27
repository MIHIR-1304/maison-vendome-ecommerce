package com.aura.ecommerce.paymentservice.service;

import com.aura.ecommerce.paymentservice.client.NotificationServiceClient;
import com.aura.ecommerce.paymentservice.client.OrderServiceClient;
import com.aura.ecommerce.paymentservice.dto.CheckoutSessionResponse;
import com.aura.ecommerce.paymentservice.dto.CreateSessionRequest;
import com.aura.ecommerce.paymentservice.dto.OrderRefDto;
import com.aura.ecommerce.paymentservice.dto.PaymentDto;
import com.aura.ecommerce.paymentservice.entity.PaymentTransaction;
import com.aura.ecommerce.paymentservice.entity.WebhookEvent;
import com.aura.ecommerce.paymentservice.repository.PaymentTransactionRepository;
import com.aura.ecommerce.paymentservice.repository.WebhookEventRepository;
import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final PaymentTransactionRepository paymentRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final OrderServiceClient orderServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    private final String stripeApiKey;
    private final String stripeWebhookSecret;
    private final String successUrl;
    private final String cancelUrl;

    public PaymentServiceImpl(
            PaymentTransactionRepository paymentRepository,
            WebhookEventRepository webhookEventRepository,
            OrderServiceClient orderServiceClient,
            NotificationServiceClient notificationServiceClient,
            @Value("${stripe.api-key:}") String stripeApiKey,
            @Value("${stripe.webhook-secret:}") String stripeWebhookSecret,
            @Value("${stripe.success-url:http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}}") String successUrl,
            @Value("${stripe.cancel-url:http://localhost:5173/payment/cancel?session_id={CHECKOUT_SESSION_ID}}") String cancelUrl) {
        this.paymentRepository = paymentRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.orderServiceClient = orderServiceClient;
        this.notificationServiceClient = notificationServiceClient;
        this.stripeApiKey = stripeApiKey != null ? stripeApiKey.trim() : "";
        this.stripeWebhookSecret = stripeWebhookSecret != null ? stripeWebhookSecret.trim() : "";
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
    }

    @Override
    public CheckoutSessionResponse createCheckoutSession(Long userId, String email, CreateSessionRequest request) {
        OrderRefDto order = orderServiceClient.getOrderById(request.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found with ID: " + request.getOrderId()));

        if (!order.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: Order belongs to a different user");
        }

        if (!"PENDING_PAYMENT".equalsIgnoreCase(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is not in PENDING_PAYMENT status: " + order.getStatus());
        }

        boolean hasRealStripe = stripeApiKey.startsWith("sk_");

        if (hasRealStripe) {
            try {
                Stripe.apiKey = stripeApiKey;

                long amountInCents = order.getTotalAmount().multiply(new BigDecimal(100)).longValue();

                SessionCreateParams params = SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setCustomerEmail(order.getCustomerEmail())
                        .setSuccessUrl(successUrl)
                        .setCancelUrl(cancelUrl)
                        .putMetadata("orderId", String.valueOf(order.getId()))
                        .putMetadata("orderNumber", order.getOrderNumber())
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(amountInCents)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName("Order " + order.getOrderNumber())
                                                                        .setDescription("AURA Online Purchase - Total Amount")
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

                Session session = Session.create(params);

                PaymentTransaction transaction = new PaymentTransaction();
                transaction.setOrderId(order.getId());
                transaction.setOrderNumber(order.getOrderNumber());
                transaction.setAmount(order.getTotalAmount());
                transaction.setCurrency("usd");
                transaction.setProvider("STRIPE");
                transaction.setSessionId(session.getId());
                transaction.setStatus("PENDING");
                paymentRepository.save(transaction);

                return new CheckoutSessionResponse(
                        session.getId(),
                        session.getUrl(),
                        "STRIPE",
                        order.getId(),
                        order.getOrderNumber(),
                        order.getTotalAmount(),
                        "usd"
                );
            } catch (Exception ex) {
                log.error("Stripe Checkout Session creation failed. Falling back to local Mock Provider: {}", ex.getMessage());
            }
        }

        // Mock Provider Fallback for Local Development & Testing
        log.info("Creating local mock payment session for Order ID: {}", order.getId());
        String mockSessionId = "mock_sess_" + UUID.randomUUID().toString().replace("-", "");
        String mockCheckoutUrl = "/payment/mock-checkout?session_id=" + mockSessionId + "&order_id=" + order.getId() + "&amount=" + order.getTotalAmount();

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setOrderId(order.getId());
        transaction.setOrderNumber(order.getOrderNumber());
        transaction.setAmount(order.getTotalAmount());
        transaction.setCurrency("usd");
        transaction.setProvider("MOCK_PROVIDER");
        transaction.setSessionId(mockSessionId);
        transaction.setStatus("PENDING");
        paymentRepository.save(transaction);

        return new CheckoutSessionResponse(
                mockSessionId,
                mockCheckoutUrl,
                "MOCK_PROVIDER",
                order.getId(),
                order.getOrderNumber(),
                order.getTotalAmount(),
                "usd"
        );
    }

    @Override
    public void handleStripeWebhook(String payload, String signature) {
        Event event;
        if (!stripeWebhookSecret.isBlank()) {
            try {
                event = Webhook.constructEvent(payload, signature, stripeWebhookSecret);
            } catch (Exception e) {
                log.error("Stripe Webhook signature verification failed: {}", e.getMessage());
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid signature");
            }
        } else {
            // For local development without webhook secret, parse event directly
            try {
                event = com.stripe.net.ApiResource.GSON.fromJson(payload, Event.class);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Malformed webhook payload");
            }
        }

        // Idempotency: Ignore duplicate deliveries of the same event
        if (webhookEventRepository.existsByEventId(event.getId())) {
            log.info("Duplicate webhook event ignored: {}", event.getId());
            return;
        }

        // Record event in database
        webhookEventRepository.save(new WebhookEvent(event.getId(), event.getType(), payload));

        if ("checkout.session.completed".equals(event.getType())) {
            Optional<Session> sessionOpt = event.getDataObjectDeserializer().getObject().map(o -> (Session) o);
            if (sessionOpt.isPresent()) {
                Session session = sessionOpt.get();
                String sessionId = session.getId();
                String paymentIntentId = session.getPaymentIntent();

                paymentRepository.findBySessionId(sessionId).ifPresent(tx -> {
                    tx.setStatus("PAID");
                    tx.setPaymentIntentId(paymentIntentId);
                    paymentRepository.save(tx);

                    // Authenticated internal update to Order Service
                    orderServiceClient.updatePaymentStatus(tx.getOrderId(), "PAID", sessionId, paymentIntentId);
                    log.info("Order ID {} marked as PAID via Stripe webhook", tx.getOrderId());
                });
            }
        } else if ("checkout.session.expired".equals(event.getType())) {
            Optional<Session> sessionOpt = event.getDataObjectDeserializer().getObject().map(o -> (Session) o);
            if (sessionOpt.isPresent()) {
                Session session = sessionOpt.get();
                paymentRepository.findBySessionId(session.getId()).ifPresent(tx -> {
                    tx.setStatus("CANCELLED");
                    paymentRepository.save(tx);
                    orderServiceClient.updatePaymentStatus(tx.getOrderId(), "CANCELLED", session.getId(), null);
                });
            }
        }
    }

    @Override
    public PaymentDto handleMockComplete(String sessionId, String outcome) {
        PaymentTransaction tx = paymentRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment transaction not found for session: " + sessionId));

        boolean isPaid = "PAID".equalsIgnoreCase(outcome) || "SUCCESS".equalsIgnoreCase(outcome);

        if (isPaid) {
            tx.setStatus("PAID");
            tx.setPaymentIntentId("mock_pi_" + UUID.randomUUID().toString().substring(0, 8));
            PaymentTransaction saved = paymentRepository.save(tx);

            orderServiceClient.updatePaymentStatus(tx.getOrderId(), "PAID", sessionId, tx.getPaymentIntentId());
            return PaymentDto.fromEntity(saved);
        } else {
            tx.setStatus("CANCELLED");
            PaymentTransaction saved = paymentRepository.save(tx);

            orderServiceClient.updatePaymentStatus(tx.getOrderId(), "CANCELLED", sessionId, null);
            return PaymentDto.fromEntity(saved);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDto getPaymentBySessionId(String sessionId) {
        PaymentTransaction tx = paymentRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found for session: " + sessionId));
        return PaymentDto.fromEntity(tx);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDto getPaymentByOrderId(Long orderId) {
        PaymentTransaction tx = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found for order ID: " + orderId));
        return PaymentDto.fromEntity(tx);
    }
}
