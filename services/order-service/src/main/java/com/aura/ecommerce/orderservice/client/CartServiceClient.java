package com.aura.ecommerce.orderservice.client;

import com.aura.ecommerce.orderservice.dto.CartDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Component
public class CartServiceClient {

    private static final Logger log = LoggerFactory.getLogger(CartServiceClient.class);

    private final RestTemplate restTemplate;
    private final String cartServiceUrl;

    public CartServiceClient(
            RestTemplate restTemplate,
            @Value("${services.cart-service-url}") String cartServiceUrl) {
        this.restTemplate = restTemplate;
        this.cartServiceUrl = cartServiceUrl;
    }

    public Optional<CartDto> getCartByUserId(Long userId) {
        String url = cartServiceUrl + "/api/cart/internal/user/" + userId;
        try {
            CartDto cart = restTemplate.getForObject(url, CartDto.class);
            return Optional.ofNullable(cart);
        } catch (Exception e) {
            log.warn("Could not fetch cart for user ID {} from {}: {}", userId, url, e.getMessage());
            return Optional.empty();
        }
    }

    public void clearCartByUserId(Long userId) {
        String url = cartServiceUrl + "/api/cart/internal/user/" + userId;
        try {
            restTemplate.delete(url);
        } catch (Exception e) {
            log.warn("Could not clear cart for user ID {}: {}", userId, e.getMessage());
        }
    }
}
