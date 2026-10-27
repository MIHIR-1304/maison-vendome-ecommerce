package com.aura.ecommerce.cartservice.controller;

import com.aura.ecommerce.cartservice.dto.AddToCartRequest;
import com.aura.ecommerce.cartservice.dto.CartDto;
import com.aura.ecommerce.cartservice.dto.UpdateCartItemRequest;
import com.aura.ecommerce.cartservice.security.UserPrincipal;
import com.aura.ecommerce.cartservice.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Shopping Cart APIs", description = "Endpoints for customer shopping cart operations and line total calculations")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private Long getUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return principal.getId();
        }
        throw new IllegalStateException("User identity could not be verified from token");
    }

    @GetMapping
    @Operation(summary = "Get current authenticated customer cart", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<CartDto> getCart(Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<CartDto> addItem(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(cartService.addItem(userId, request));
    }

    @PatchMapping("/items/{productId}")
    @Operation(summary = "Update quantity of item in cart", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<CartDto> updateItem(
            Authentication authentication,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(cartService.updateItem(userId, productId, request));
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Remove item from cart", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<CartDto> removeItem(
            Authentication authentication,
            @PathVariable Long productId) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
    }

    @DeleteMapping
    @Operation(summary = "Clear customer cart", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<Map<String, String>> clearCart(Authentication authentication) {
        Long userId = getUserId(authentication);
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }

    // Service-to-service internal endpoints for Order Service
    @GetMapping("/internal/user/{userId}")
    @Operation(summary = "Get cart by user ID (Internal Order Service use)")
    public ResponseEntity<CartDto> getCartInternal(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @DeleteMapping("/internal/user/{userId}")
    @Operation(summary = "Clear cart by user ID (Internal Order Service use)")
    public ResponseEntity<Map<String, String>> clearCartInternal(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared for user: " + userId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "cart-service"));
    }
}
