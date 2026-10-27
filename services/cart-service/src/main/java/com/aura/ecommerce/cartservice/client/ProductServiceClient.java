package com.aura.ecommerce.cartservice.client;

import com.aura.ecommerce.cartservice.dto.ProductRefDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Component
public class ProductServiceClient {

    private static final Logger log = LoggerFactory.getLogger(ProductServiceClient.class);

    private final RestTemplate restTemplate;
    private final String productServiceUrl;

    public ProductServiceClient(
            RestTemplate restTemplate,
            @Value("${services.product-service-url}") String productServiceUrl) {
        this.restTemplate = restTemplate;
        this.productServiceUrl = productServiceUrl;
    }

    public Optional<ProductRefDto> getProductById(Long productId) {
        String url = productServiceUrl + "/api/products/" + productId;
        try {
            ProductRefDto product = restTemplate.getForObject(url, ProductRefDto.class);
            return Optional.ofNullable(product);
        } catch (Exception e) {
            log.warn("Could not fetch product with ID {} from {}: {}", productId, url, e.getMessage());
            return Optional.empty();
        }
    }
}
