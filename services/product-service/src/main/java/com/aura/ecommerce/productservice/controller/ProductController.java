package com.aura.ecommerce.productservice.controller;

import com.aura.ecommerce.productservice.dto.*;
import com.aura.ecommerce.productservice.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Catalogue APIs", description = "Endpoints for browsing, searching, filtering and administrative management of products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Search and filter products with pagination")
    public ResponseEntity<ProductPageResponse> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sortBy) {
        ProductPageResponse response = productService.getProducts(categoryId, search, minPrice, maxPrice, page, size, sortBy);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single product by ID")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get single product by URL slug")
    public ResponseEntity<ProductDto> getProductBySlug(@PathVariable String slug) {
        ProductDto product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new product (Admin only)", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductDto created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product details and stock (Admin only)", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        ProductDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate product (Admin only)", security = @SecurityRequirement(name = "BearerAuth"))
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reserve")
    @Operation(summary = "Atomically reserve stock quantity (Internal / Order Service)")
    public ResponseEntity<StockReservationResponse> reserveStock(
            @PathVariable Long id,
            @Valid @RequestBody StockReservationRequest request) {
        StockReservationResponse response = productService.reserveStock(id, request.getQuantity());
        if (response.isReserved()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @PostMapping("/{id}/release")
    @Operation(summary = "Release previously reserved stock (Internal / Order Service)")
    public ResponseEntity<Map<String, Object>> releaseStock(
            @PathVariable Long id,
            @Valid @RequestBody StockReservationRequest request) {
        productService.releaseStock(id, request.getQuantity());
        return ResponseEntity.ok(Map.of("productId", id, "releasedQuantity", request.getQuantity(), "status", "RELEASED"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "product-service"));
    }
}
