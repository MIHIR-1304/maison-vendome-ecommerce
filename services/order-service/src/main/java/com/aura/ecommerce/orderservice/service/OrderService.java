package com.aura.ecommerce.orderservice.service;

import com.aura.ecommerce.orderservice.dto.*;
import com.aura.ecommerce.orderservice.entity.OrderStatus;

import java.util.List;

public interface OrderService {
    OrderDto checkout(Long userId, String email, String fullName, CheckoutRequest request);
    OrderDto getOrderById(Long orderId, Long userId, boolean isAdmin);
    List<OrderDto> getOrdersForUser(Long userId);
    List<OrderDto> getAllOrders();
    OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus);
    OrderDto handlePaymentUpdate(Long orderId, InternalPaymentUpdateRequest request);
}
