package com.aura.ecommerce.productservice.dto;

public class StockReservationResponse {
    private Long productId;
    private Integer requestedQuantity;
    private boolean reserved;
    private String message;

    public StockReservationResponse() {}

    public StockReservationResponse(Long productId, Integer requestedQuantity, boolean reserved, String message) {
        this.productId = productId;
        this.requestedQuantity = requestedQuantity;
        this.reserved = reserved;
        this.message = message;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public boolean isReserved() { return reserved; }
    public void setReserved(boolean reserved) { this.reserved = reserved; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
