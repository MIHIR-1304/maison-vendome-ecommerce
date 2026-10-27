package com.aura.ecommerce.orderservice.dto;

import com.aura.ecommerce.orderservice.entity.OrderStatus;

public class InternalPaymentUpdateRequest {
    private OrderStatus status;
    private String paymentSessionId;
    private String paymentId;

    public InternalPaymentUpdateRequest() {}

    public InternalPaymentUpdateRequest(OrderStatus status, String paymentSessionId, String paymentId) {
        this.status = status;
        this.paymentSessionId = paymentSessionId;
        this.paymentId = paymentId;
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getPaymentSessionId() { return paymentSessionId; }
    public void setPaymentSessionId(String paymentSessionId) { this.paymentSessionId = paymentSessionId; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}
