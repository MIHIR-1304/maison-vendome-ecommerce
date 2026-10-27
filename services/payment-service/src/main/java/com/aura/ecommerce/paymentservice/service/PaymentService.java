package com.aura.ecommerce.paymentservice.service;

import com.aura.ecommerce.paymentservice.dto.CheckoutSessionResponse;
import com.aura.ecommerce.paymentservice.dto.CreateSessionRequest;
import com.aura.ecommerce.paymentservice.dto.PaymentDto;

public interface PaymentService {
    CheckoutSessionResponse createCheckoutSession(Long userId, String email, CreateSessionRequest request);
    void handleStripeWebhook(String payload, String signature);
    PaymentDto handleMockComplete(String sessionId, String outcome);
    PaymentDto getPaymentBySessionId(String sessionId);
    PaymentDto getPaymentByOrderId(Long orderId);
}
