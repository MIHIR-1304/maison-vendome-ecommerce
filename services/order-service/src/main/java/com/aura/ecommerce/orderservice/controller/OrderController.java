package com.aura.ecommerce.orderservice.controller;

import com.aura.ecommerce.orderservice.dto.CheckoutRequest;
import com.aura.ecommerce.orderservice.dto.InternalPaymentUpdateRequest;
import com.aura.ecommerce.orderservice.dto.OrderDto;
import com.aura.ecommerce.orderservice.dto.UpdateOrderStatusRequest;
import com.aura.ecommerce.orderservice.security.UserPrincipal;
import com.aura.ecommerce.orderservice.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order Management APIs", description = "Endpoints for multi-step checkout, order history, inventory reservation and status transitions")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private UserPrincipal getPrincipal(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal p) {
            return p;
        }
        throw new IllegalStateException("Authentication required");
    }

    @PostMapping("/checkout")
    @Operation(summary = "Create order from cart with atomic inventory reservation", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<OrderDto> checkout(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequest request) {
        UserPrincipal principal = getPrincipal(authentication);
        OrderDto order = orderService.checkout(principal.getId(), principal.getUsername(), principal.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    @Operation(summary = "Get user order history or all orders for Admin", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<List<OrderDto>> getOrders(Authentication authentication) {
        UserPrincipal principal = getPrincipal(authentication);
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(orderService.getAllOrders());
        } else {
            return ResponseEntity.ok(orderService.getOrdersForUser(principal.getId()));
        }
    }

    @GetMapping("/{id}/internal")
    @Operation(summary = "Internal order details lookup for Payment Service")
    public ResponseEntity<OrderDto> getInternalOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id, null, true));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single order details by ID", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<OrderDto> getOrderById(
            Authentication authentication,
            @PathVariable Long id) {
        UserPrincipal principal = getPrincipal(authentication);
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        OrderDto order = orderService.getOrderById(id, principal.getId(), isAdmin);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (Admin only)", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderDto updated = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/internal-payment-update")
    @Operation(summary = "Internal callback from Payment Service after payment completion/failure")
    public ResponseEntity<OrderDto> handleInternalPaymentUpdate(
            @PathVariable Long id,
            @RequestBody InternalPaymentUpdateRequest request) {
        OrderDto updated = orderService.handlePaymentUpdate(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "order-service"));
    }
}
