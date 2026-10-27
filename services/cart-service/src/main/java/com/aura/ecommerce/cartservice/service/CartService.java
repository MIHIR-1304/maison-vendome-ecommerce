package com.aura.ecommerce.cartservice.service;

import com.aura.ecommerce.cartservice.dto.AddToCartRequest;
import com.aura.ecommerce.cartservice.dto.CartDto;
import com.aura.ecommerce.cartservice.dto.UpdateCartItemRequest;

public interface CartService {
    CartDto getCart(Long userId);
    CartDto addItem(Long userId, AddToCartRequest request);
    CartDto updateItem(Long userId, Long productId, UpdateCartItemRequest request);
    CartDto removeItem(Long userId, Long productId);
    void clearCart(Long userId);
}
