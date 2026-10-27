package com.aura.ecommerce.productservice.service;

import com.aura.ecommerce.productservice.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    ProductPageResponse getProducts(Long categoryId, String search, BigDecimal minPrice, BigDecimal maxPrice, int page, int size, String sortBy);
    ProductDto getProductById(Long id);
    ProductDto getProductBySlug(String slug);
    ProductDto createProduct(CreateProductRequest request);
    ProductDto updateProduct(Long id, UpdateProductRequest request);
    void deleteProduct(Long id);
    StockReservationResponse reserveStock(Long id, Integer quantity);
    void releaseStock(Long id, Integer quantity);
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Long id);
}
