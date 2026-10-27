package com.aura.ecommerce.paymentservice.dto;

import jakarta.validation.constraints.NotNull;

public class CreateSessionRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    public CreateSessionRequest() {}

    public CreateSessionRequest(Long orderId) {
        this.orderId = orderId;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
}
