package com.aura.ecommerce.orderservice.service;

import com.aura.ecommerce.orderservice.client.CartServiceClient;
import com.aura.ecommerce.orderservice.client.NotificationServiceClient;
import com.aura.ecommerce.orderservice.client.ProductServiceClient;
import com.aura.ecommerce.orderservice.dto.*;
import com.aura.ecommerce.orderservice.entity.Order;
import com.aura.ecommerce.orderservice.entity.OrderItem;
import com.aura.ecommerce.orderservice.entity.OrderStatus;
import com.aura.ecommerce.orderservice.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final ProductServiceClient productServiceClient;
    private final CartServiceClient cartServiceClient;
    private final NotificationServiceClient notificationServiceClient;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            ProductServiceClient productServiceClient,
            CartServiceClient cartServiceClient,
            NotificationServiceClient notificationServiceClient) {
        this.orderRepository = orderRepository;
        this.productServiceClient = productServiceClient;
        this.cartServiceClient = cartServiceClient;
        this.notificationServiceClient = notificationServiceClient;
    }

    @Override
    public OrderDto checkout(Long userId, String email, String fullName, CheckoutRequest request) {
        // 1. Gather Items from Cart or Direct Items
        List<CheckoutItemDto> itemsToCheckout = new ArrayList<>();

        Optional<CartDto> cartOpt = cartServiceClient.getCartByUserId(userId);
        if (cartOpt.isPresent() && !cartOpt.get().getItems().isEmpty()) {
            for (CartDto.CartItemDto ci : cartOpt.get().getItems()) {
                itemsToCheckout.add(new CheckoutItemDto(ci.getProductId(), ci.getQuantity()));
            }
        } else if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CheckoutRequest.CheckoutItemRequest r : request.getItems()) {
                itemsToCheckout.add(new CheckoutItemDto(r.getProductId(), r.getQuantity()));
            }
        }

        if (itemsToCheckout.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shopping cart is empty. Cannot checkout.");
        }

        // 2. Fetch authoritative product details and compute server-side prices
        List<VerifiedItem> verifiedItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (CheckoutItemDto item : itemsToCheckout) {
            ProductRefDto product = productServiceClient.getProductById(item.productId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product not found: " + item.productId()));

            if (Boolean.FALSE.equals(product.getActive())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is no longer available: " + product.getName());
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.quantity()));
            subtotal = subtotal.add(lineTotal);

            verifiedItems.add(new VerifiedItem(product.getId(), product.getName(), unitPrice, item.quantity(), lineTotal));
        }

        // 3. Atomic Inventory Reservation with Automatic Compensating Rollback
        List<VerifiedItem> successfullyReserved = new ArrayList<>();
        try {
            for (VerifiedItem item : verifiedItems) {
                boolean reserved = productServiceClient.reserveStock(item.productId(), item.quantity());
                if (!reserved) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Insufficient inventory for product: " + item.productName() + ". Requested: " + item.quantity()
                    );
                }
                successfullyReserved.add(item);
            }
        } catch (Exception ex) {
            // Compensating action: release all items that were successfully reserved in this transaction
            log.warn("Checkout stock reservation failed. Triggering compensating inventory release.");
            for (VerifiedItem reserved : successfullyReserved) {
                productServiceClient.releaseStock(reserved.productId(), reserved.quantity());
            }
            throw ex;
        }

        // 4. Calculate Taxes and Shipping
        BigDecimal shippingFee = subtotal.compareTo(new BigDecimal("150.00")) >= 0 ? BigDecimal.ZERO : new BigDecimal("15.00");
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.08")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(shippingFee).add(tax);

        // 5. Create Order and Immutable Snapshots
        String orderNumber = "ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUserId(userId);
        order.setCustomerEmail(email);
        order.setCustomerName(fullName);
        order.setShippingAddress(request.getShippingAddress().trim());
        order.setCity(request.getCity().trim());
        order.setPostalCode(request.getPostalCode().trim());
        order.setCountry(request.getCountry().trim());
        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setTax(tax);
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING_PAYMENT);

        for (VerifiedItem vi : verifiedItems) {
            OrderItem orderItem = new OrderItem(order, vi.productId(), vi.productName(), vi.unitPrice(), vi.quantity());
            order.getItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // 6. Clear Customer Cart
        cartServiceClient.clearCartByUserId(userId);

        // 7. Dispatch ORDER_CREATED Event to Notification Service
        Map<String, Object> eventPayload = Map.of(
                "orderId", savedOrder.getId(),
                "orderNumber", savedOrder.getOrderNumber(),
                "customerEmail", email,
                "customerName", fullName,
                "totalAmount", totalAmount.toString(),
                "itemCount", savedOrder.getItems().size()
        );
        notificationServiceClient.dispatchEvent("ORDER_CREATED", email, "Your Order " + orderNumber + " Has Been Placed", eventPayload);

        return OrderDto.fromEntity(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, Long userId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found with ID: " + orderId));

        if (!isAdmin && !order.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to view this order");
        }

        return OrderDto.fromEntity(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersForUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found with ID: " + orderId));

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);

        if (newStatus == OrderStatus.FULFILLED) {
            notificationServiceClient.dispatchEvent(
                    "ORDER_SHIPPED",
                    order.getCustomerEmail(),
                    "Your Order " + order.getOrderNumber() + " Has Shipped!",
                    Map.of("orderNumber", order.getOrderNumber())
            );
        }

        return OrderDto.fromEntity(updated);
    }

    @Override
    public OrderDto handlePaymentUpdate(Long orderId, InternalPaymentUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found with ID: " + orderId));

        // Idempotency: if already in target status, return
        if (order.getStatus() == request.getStatus()) {
            return OrderDto.fromEntity(order);
        }

        if (request.getStatus() == OrderStatus.PAID) {
            order.setStatus(OrderStatus.PAID);
            order.setPaymentSessionId(request.getPaymentSessionId());
            order.setPaymentId(request.getPaymentId());
            Order updated = orderRepository.save(order);

            notificationServiceClient.dispatchEvent(
                    "PAYMENT_CONFIRMED",
                    order.getCustomerEmail(),
                    "Payment Received for Order " + order.getOrderNumber(),
                    Map.of("orderNumber", order.getOrderNumber(), "amount", order.getTotalAmount().toString())
            );

            return OrderDto.fromEntity(updated);
        } else if (request.getStatus() == OrderStatus.CANCELLED || request.getStatus() == OrderStatus.PAYMENT_FAILED) {
            // Compensating action: Release reserved inventory back to catalogue
            if (order.getStatus() == OrderStatus.PENDING_PAYMENT) {
                log.info("Order {} payment cancelled or failed. Releasing reserved stock.", order.getOrderNumber());
                for (OrderItem item : order.getItems()) {
                    productServiceClient.releaseStock(item.getProductId(), item.getQuantity());
                }
            }

            order.setStatus(request.getStatus());
            order.setPaymentSessionId(request.getPaymentSessionId());
            Order updated = orderRepository.save(order);

            notificationServiceClient.dispatchEvent(
                    "PAYMENT_FAILED",
                    order.getCustomerEmail(),
                    "Payment Unsuccessful for Order " + order.getOrderNumber(),
                    Map.of("orderNumber", order.getOrderNumber())
            );

            return OrderDto.fromEntity(updated);
        }

        return OrderDto.fromEntity(order);
    }

    private record CheckoutItemDto(Long productId, Integer quantity) {}
    private record VerifiedItem(Long productId, String productName, BigDecimal unitPrice, Integer quantity, BigDecimal totalPrice) {}
}
