package com.aura.ecommerce.orderservice.dto;

public class StockReservationResponse {
    private Long productId;
    private Integer requestedQuantity;
    private boolean reserved;
    private String message;

    public StockReservationResponse() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public boolean isReserved() { return reserved; }
    public void setReserved(boolean reserved) { this.reserved = reserved; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
