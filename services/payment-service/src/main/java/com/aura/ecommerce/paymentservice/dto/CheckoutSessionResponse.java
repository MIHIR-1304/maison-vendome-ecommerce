package com.aura.ecommerce.paymentservice.dto;

import java.math.BigDecimal;

public class CheckoutSessionResponse {
    private String sessionId;
    private String checkoutUrl;
    private String provider; // "STRIPE" or "MOCK_PROVIDER"
    private Long orderId;
    private String orderNumber;
    private BigDecimal amount;
    private String currency;

    public CheckoutSessionResponse() {}

    public CheckoutSessionResponse(String sessionId, String checkoutUrl, String provider, Long orderId, String orderNumber, BigDecimal amount, String currency) {
        this.sessionId = sessionId;
        this.checkoutUrl = checkoutUrl;
        this.provider = provider;
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.amount = amount;
        this.currency = currency;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getCheckoutUrl() { return checkoutUrl; }
    public void setCheckoutUrl(String checkoutUrl) { this.checkoutUrl = checkoutUrl; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
