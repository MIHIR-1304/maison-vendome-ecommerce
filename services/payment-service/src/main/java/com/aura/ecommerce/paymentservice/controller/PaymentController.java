package com.aura.ecommerce.paymentservice.controller;

import com.aura.ecommerce.paymentservice.dto.CheckoutSessionResponse;
import com.aura.ecommerce.paymentservice.dto.CreateSessionRequest;
import com.aura.ecommerce.paymentservice.dto.PaymentDto;
import com.aura.ecommerce.paymentservice.security.UserPrincipal;
import com.aura.ecommerce.paymentservice.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment Service APIs", description = "Endpoints for Stripe Checkout integration, mock payment simulation, and idempotent webhook processing")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    private UserPrincipal getPrincipal(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal p) {
            return p;
        }
        throw new IllegalStateException("Authentication required");
    }

    @PostMapping("/checkout-session")
    @Operation(summary = "Create Stripe or Mock checkout session for pending order", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(
            Authentication authentication,
            @Valid @RequestBody CreateSessionRequest request) {
        UserPrincipal principal = getPrincipal(authentication);
        CheckoutSessionResponse response = paymentService.createCheckoutSession(principal.getId(), principal.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    @Operation(summary = "Stripe webhook endpoint with signature verification & idempotency")
    public ResponseEntity<Map<String, String>> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String signature) {
        paymentService.handleStripeWebhook(payload, signature);
        return ResponseEntity.ok(Map.of("received", "true"));
    }

    @PostMapping("/mock-complete/{sessionId}")
    @Operation(summary = "Complete mock payment (for local testing without live Stripe webhooks)")
    public ResponseEntity<PaymentDto> completeMockPayment(
            @PathVariable String sessionId,
            @RequestParam(defaultValue = "PAID") String outcome) {
        PaymentDto payment = paymentService.handleMockComplete(sessionId, outcome);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/session/{sessionId}")
    @Operation(summary = "Get payment transaction by Stripe/Mock Session ID")
    public ResponseEntity<PaymentDto> getPaymentBySession(@PathVariable String sessionId) {
        return ResponseEntity.ok(paymentService.getPaymentBySessionId(sessionId));
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payment transaction by Order ID")
    public ResponseEntity<PaymentDto> getPaymentByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "payment-service"));
    }
}
