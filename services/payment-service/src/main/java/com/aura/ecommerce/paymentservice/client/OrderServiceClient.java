package com.aura.ecommerce.paymentservice.client;

import com.aura.ecommerce.paymentservice.dto.InternalPaymentUpdateRequest;
import com.aura.ecommerce.paymentservice.dto.OrderRefDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Component
public class OrderServiceClient {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceClient.class);

    private final RestTemplate restTemplate;
    private final String orderServiceUrl;

    public OrderServiceClient(
            RestTemplate restTemplate,
            @Value("${services.order-service-url}") String orderServiceUrl) {
        this.restTemplate = restTemplate;
        this.orderServiceUrl = orderServiceUrl;
    }

    public Optional<OrderRefDto> getOrderById(Long orderId) {
        String url = orderServiceUrl + "/api/orders/" + orderId + "/internal";
        try {
            OrderRefDto order = restTemplate.getForObject(url, OrderRefDto.class);
            return Optional.ofNullable(order);
        } catch (Exception e) {
            log.warn("Could not fetch order ID {} from {}: {}", orderId, url, e.getMessage());
            return Optional.empty();
        }
    }

    public void updatePaymentStatus(Long orderId, String status, String sessionId, String paymentId) {
        String url = orderServiceUrl + "/api/orders/" + orderId + "/internal-payment-update";
        try {
            InternalPaymentUpdateRequest request = new InternalPaymentUpdateRequest(status, sessionId, paymentId);
            restTemplate.postForEntity(url, request, Object.class);
            log.info("Successfully updated order ID {} payment status to {}", orderId, status);
        } catch (Exception e) {
            log.error("Failed to update payment status for order ID {}: {}", orderId, e.getMessage());
        }
    }
}
