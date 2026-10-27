package com.aura.ecommerce.productservice;

import com.aura.ecommerce.productservice.dto.CreateProductRequest;
import com.aura.ecommerce.productservice.dto.ProductDto;
import com.aura.ecommerce.productservice.dto.ProductPageResponse;
import com.aura.ecommerce.productservice.dto.StockReservationResponse;
import com.aura.ecommerce.productservice.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    @DisplayName("Should retrieve products with pagination and category filtering")
    void shouldRetrieveProducts() {
        ProductPageResponse response = productService.getProducts(null, null, null, null, 0, 10, "newest");
        assertNotNull(response);
        assertTrue(response.getTotalElements() > 0);
        assertFalse(response.getContent().isEmpty());
    }

    @Test
    @DisplayName("Should create product with valid parameters")
    void shouldCreateProduct() {
        CreateProductRequest req = new CreateProductRequest();
        req.setName("Test Artisan Coffee Grinder");
        req.setDescription("Conical burr grinder with 40 grind settings");
        req.setPrice(new BigDecimal("129.99"));
        req.setStockQuantity(50);

        ProductDto created = productService.createProduct(req);
        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals("Test Artisan Coffee Grinder", created.getName());
        assertEquals(new BigDecimal("129.99"), created.getPrice());
        assertEquals(50, created.getStockQuantity());
    }

    @Test
    @DisplayName("Should atomically reserve stock and prevent overselling")
    void shouldAtomicallyReserveStock() {
        CreateProductRequest req = new CreateProductRequest();
        req.setName("Limited Edition Mechanical Pencil");
        req.setDescription("Solid brass 0.5mm drafting pencil");
        req.setPrice(new BigDecimal("45.00"));
        req.setStockQuantity(5); // Only 5 available

        ProductDto created = productService.createProduct(req);

        // 1. Reserve 3 items -> Should succeed
        StockReservationResponse res1 = productService.reserveStock(created.getId(), 3);
        assertTrue(res1.isReserved());

        // Check updated stock
        ProductDto afterRes1 = productService.getProductById(created.getId());
        assertEquals(2, afterRes1.getStockQuantity());

        // 2. Try to reserve 3 more items (only 2 left) -> Should fail, preventing overselling!
        StockReservationResponse res2 = productService.reserveStock(created.getId(), 3);
        assertFalse(res2.isReserved());

        // Check stock remained at 2
        ProductDto afterFailedRes = productService.getProductById(created.getId());
        assertEquals(2, afterFailedRes.getStockQuantity());

        // 3. Compensating release: release the 3 items back
        productService.releaseStock(created.getId(), 3);
        ProductDto afterRelease = productService.getProductById(created.getId());
        assertEquals(5, afterRelease.getStockQuantity());
    }
}
