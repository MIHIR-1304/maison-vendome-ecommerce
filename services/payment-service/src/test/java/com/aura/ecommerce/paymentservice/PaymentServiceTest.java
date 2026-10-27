package com.aura.ecommerce.paymentservice;

import com.aura.ecommerce.paymentservice.client.NotificationServiceClient;
import com.aura.ecommerce.paymentservice.client.OrderServiceClient;
import com.aura.ecommerce.paymentservice.dto.CheckoutSessionResponse;
import com.aura.ecommerce.paymentservice.dto.CreateSessionRequest;
import com.aura.ecommerce.paymentservice.dto.OrderRefDto;
import com.aura.ecommerce.paymentservice.dto.PaymentDto;
import com.aura.ecommerce.paymentservice.entity.WebhookEvent;
import com.aura.ecommerce.paymentservice.repository.WebhookEventRepository;
import com.aura.ecommerce.paymentservice.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class PaymentServiceTest {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private WebhookEventRepository webhookEventRepository;

    @MockBean
    private OrderServiceClient orderServiceClient;

    @MockBean
    private NotificationServiceClient notificationServiceClient;

    @BeforeEach
    void setupMockOrder() {
        OrderRefDto mockOrder = new OrderRefDto();
        mockOrder.setId(500L);
        mockOrder.setOrderNumber("ORD-TEST-500");
        mockOrder.setUserId(1L);
        mockOrder.setCustomerEmail("tester@example.com");
        mockOrder.setTotalAmount(new BigDecimal("299.00"));
        mockOrder.setStatus("PENDING_PAYMENT");

        when(orderServiceClient.getOrderById(eq(500L))).thenReturn(Optional.of(mockOrder));
    }

    @Test
    @DisplayName("Should create mock checkout session when Stripe API key is not provided")
    void shouldCreateMockCheckoutSession() {
        CheckoutSessionResponse res = paymentService.createCheckoutSession(1L, "tester@example.com", new CreateSessionRequest(500L));

        assertNotNull(res);
        assertNotNull(res.getSessionId());
        assertEquals("MOCK_PROVIDER", res.getProvider());
        assertEquals(500L, res.getOrderId());
        assertEquals("ORD-TEST-500", res.getOrderNumber());
        assertEquals(new BigDecimal("299.00"), res.getAmount());

        // Now complete mock payment
        PaymentDto completed = paymentService.handleMockComplete(res.getSessionId(), "PAID");
        assertEquals("PAID", completed.getStatus());
        verify(orderServiceClient, times(1)).updatePaymentStatus(eq(500L), eq("PAID"), eq(res.getSessionId()), any());
    }

    @Test
    @DisplayName("Should handle duplicate webhook events idempotently")
    void shouldHandleDuplicateWebhooksIdempotently() {
        String eventId = "evt_test_duplicate_123";
        webhookEventRepository.save(new WebhookEvent(eventId, "checkout.session.completed", "{}"));

        assertTrue(webhookEventRepository.existsByEventId(eventId));

        // When duplicate webhook arrives, it should not throw and should safely ignore
        assertDoesNotThrow(() -> paymentService.handleStripeWebhook("{\"id\":\"" + eventId + "\",\"type\":\"checkout.session.completed\"}", null));
    }
}
