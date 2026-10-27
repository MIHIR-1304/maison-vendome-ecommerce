package com.aura.ecommerce.orderservice.dto;

public class StockReservationRequest {
    private Integer quantity;

    public StockReservationRequest() {}
    public StockReservationRequest(Integer quantity) { this.quantity = quantity; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
