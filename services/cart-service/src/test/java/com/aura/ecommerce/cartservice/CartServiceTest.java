package com.aura.ecommerce.cartservice;

import com.aura.ecommerce.cartservice.client.ProductServiceClient;
import com.aura.ecommerce.cartservice.dto.AddToCartRequest;
import com.aura.ecommerce.cartservice.dto.CartDto;
import com.aura.ecommerce.cartservice.dto.ProductRefDto;
import com.aura.ecommerce.cartservice.dto.UpdateCartItemRequest;
import com.aura.ecommerce.cartservice.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
public class CartServiceTest {

    @Autowired
    private CartService cartService;

    @MockBean
    private ProductServiceClient productServiceClient;

    @BeforeEach
    void setupMockProduct() {
        ProductRefDto mockProduct = new ProductRefDto();
        mockProduct.setId(10L);
        mockProduct.setName("ANC Headphones");
        mockProduct.setPrice(new BigDecimal("299.00"));
        mockProduct.setStockQuantity(20);
        mockProduct.setActive(true);

        when(productServiceClient.getProductById(eq(10L))).thenReturn(Optional.of(mockProduct));
    }

    @Test
    @DisplayName("Should add items to cart and compute correct line total and subtotal")
    void shouldAddItemsAndCalculateTotals() {
        Long userId = 999L;
        cartService.clearCart(userId);

        AddToCartRequest addReq = new AddToCartRequest(10L, 2);
        CartDto cart = cartService.addItem(userId, addReq);

        assertNotNull(cart);
        assertEquals(userId, cart.getUserId());
        assertEquals(1, cart.getItems().size());
        assertEquals(2, cart.getTotalItems());
        assertEquals(new BigDecimal("598.00"), cart.getSubtotal());

        // Update quantity to 3
        CartDto updatedCart = cartService.updateItem(userId, 10L, new UpdateCartItemRequest(3));
        assertEquals(3, updatedCart.getTotalItems());
        assertEquals(new BigDecimal("897.00"), updatedCart.getSubtotal());

        // Remove item
        CartDto emptyCart = cartService.removeItem(userId, 10L);
        assertEquals(0, emptyCart.getItems().size());
        assertEquals(0, emptyCart.getTotalItems());
    }

    @Test
    @DisplayName("Should clear entire cart")
    void shouldClearCart() {
        Long userId = 888L;
        cartService.addItem(userId, new AddToCartRequest(10L, 1));
        cartService.clearCart(userId);

        CartDto cart = cartService.getCart(userId);
        assertTrue(cart.getItems().isEmpty());
    }
}
