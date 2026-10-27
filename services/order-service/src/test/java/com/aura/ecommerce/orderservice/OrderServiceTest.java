package com.aura.ecommerce.orderservice;

import com.aura.ecommerce.orderservice.client.CartServiceClient;
import com.aura.ecommerce.orderservice.client.NotificationServiceClient;
import com.aura.ecommerce.orderservice.client.ProductServiceClient;
import com.aura.ecommerce.orderservice.dto.CartDto;
import com.aura.ecommerce.orderservice.dto.CheckoutRequest;
import com.aura.ecommerce.orderservice.dto.OrderDto;
import com.aura.ecommerce.orderservice.dto.ProductRefDto;
import com.aura.ecommerce.orderservice.entity.OrderStatus;
import com.aura.ecommerce.orderservice.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @MockBean
    private ProductServiceClient productServiceClient;

    @MockBean
    private CartServiceClient cartServiceClient;

    @MockBean
    private NotificationServiceClient notificationServiceClient;

    @BeforeEach
    void setupMocks() {
        ProductRefDto product1 = new ProductRefDto();
        product1.setId(101L);
        product1.setName("Monolith Chronograph");
        product1.setPrice(new BigDecimal("480.00"));
        product1.setStockQuantity(10);
        product1.setActive(true);

        when(productServiceClient.getProductById(eq(101L))).thenReturn(Optional.of(product1));
        when(productServiceClient.reserveStock(eq(101L), anyInt())).thenReturn(true);
        when(cartServiceClient.getCartByUserId(anyLong())).thenReturn(Optional.empty());
    }

    @Test
    @DisplayName("Should successfully checkout with server-side price calculation and reserve inventory")
    void shouldSuccessfullyCheckout() {
        CheckoutRequest req = new CheckoutRequest();
        req.setShippingAddress("123 Test Ave");
        req.setCity("Seattle");
        req.setPostalCode("98101");
        req.setCountry("USA");
        req.setItems(Collections.singletonList(new CheckoutRequest.CheckoutItemRequest(101L, 1)));

        OrderDto order = orderService.checkout(1L, "customer@example.com", "Test Customer", req);

        assertNotNull(order);
        assertNotNull(order.getOrderNumber());
        assertEquals(OrderStatus.PENDING_PAYMENT, order.getStatus());
        assertEquals(new BigDecimal("480.00"), order.getSubtotal());
        // Subtotal > 150 -> free shipping
        assertEquals(BigDecimal.ZERO, order.getShippingFee());
        // Tax 8% of 480 = 38.40
        assertEquals(new BigDecimal("38.40"), order.getTax());
        assertEquals(new BigDecimal("518.40"), order.getTotalAmount());
        assertEquals(1, order.getItems().size());

        // Verify stock was reserved
        verify(productServiceClient, times(1)).reserveStock(eq(101L), eq(1));
        // Verify cart was cleared
        verify(cartServiceClient, times(1)).clearCartByUserId(eq(1L));
    }

    @Test
    @DisplayName("Should abort checkout and rollback if inventory reservation fails")
    void shouldAbortWhenInventoryUnavailable() {
        when(productServiceClient.reserveStock(eq(101L), anyInt())).thenReturn(false);

        CheckoutRequest req = new CheckoutRequest();
        req.setShippingAddress("123 Test Ave");
        req.setCity("Seattle");
        req.setPostalCode("98101");
        req.setCountry("USA");
        req.setItems(Collections.singletonList(new CheckoutRequest.CheckoutItemRequest(101L, 1)));

        assertThrows(ResponseStatusException.class, () ->
                orderService.checkout(2L, "customer2@example.com", "Test Customer 2", req));
    }
}
