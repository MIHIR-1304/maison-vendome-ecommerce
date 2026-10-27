package com.aura.ecommerce.paymentservice.dto;

import com.aura.ecommerce.paymentservice.entity.PaymentTransaction;
import java.math.BigDecimal;
import java.time.Instant;

public class PaymentDto {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private BigDecimal amount;
    private String currency;
    private String provider;
    private String sessionId;
    private String paymentIntentId;
    private String status;
    private Instant createdAt;

    public PaymentDto() {}

    public static PaymentDto fromEntity(PaymentTransaction tx) {
        PaymentDto dto = new PaymentDto();
        dto.setId(tx.getId());
        dto.setOrderId(tx.getOrderId());
        dto.setOrderNumber(tx.getOrderNumber());
        dto.setAmount(tx.getAmount());
        dto.setCurrency(tx.getCurrency());
        dto.setProvider(tx.getProvider());
        dto.setSessionId(tx.getSessionId());
        dto.setPaymentIntentId(tx.getPaymentIntentId());
        dto.setStatus(tx.getStatus());
        dto.setCreatedAt(tx.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getPaymentIntentId() { return paymentIntentId; }
    public void setPaymentIntentId(String paymentIntentId) { this.paymentIntentId = paymentIntentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
