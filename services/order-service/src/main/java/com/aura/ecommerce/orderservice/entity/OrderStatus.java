package com.aura.ecommerce.orderservice.entity;

public enum OrderStatus {
    PENDING_PAYMENT,
    PAID,
    PAYMENT_FAILED,
    CANCELLED,
    FULFILLED
}
