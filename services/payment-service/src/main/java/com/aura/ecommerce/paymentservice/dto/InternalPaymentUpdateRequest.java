package com.aura.ecommerce.paymentservice.dto;

public class InternalPaymentUpdateRequest {
    private String status;
    private String paymentSessionId;
    private String paymentId;

    public InternalPaymentUpdateRequest() {}

    public InternalPaymentUpdateRequest(String status, String paymentSessionId, String paymentId) {
        this.status = status;
        this.paymentSessionId = paymentSessionId;
        this.paymentId = paymentId;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentSessionId() { return paymentSessionId; }
    public void setPaymentSessionId(String paymentSessionId) { this.paymentSessionId = paymentSessionId; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}
