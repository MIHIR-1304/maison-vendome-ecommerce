package com.aura.ecommerce.orderservice.client;

import com.aura.ecommerce.orderservice.dto.ProductRefDto;
import com.aura.ecommerce.orderservice.dto.StockReservationRequest;
import com.aura.ecommerce.orderservice.dto.StockReservationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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
            log.warn("Could not fetch product ID {} from {}: {}", productId, url, e.getMessage());
            return Optional.empty();
        }
    }

    public boolean reserveStock(Long productId, Integer quantity) {
        String url = productServiceUrl + "/api/products/" + productId + "/reserve";
        try {
            ResponseEntity<StockReservationResponse> res = restTemplate.postForEntity(
                    url,
                    new StockReservationRequest(quantity),
                    StockReservationResponse.class
            );
            return res.getBody() != null && res.getBody().isReserved();
        } catch (Exception e) {
            log.warn("Stock reservation failed for product ID {}: {}", productId, e.getMessage());
            return false;
        }
    }

    public void releaseStock(Long productId, Integer quantity) {
        String url = productServiceUrl + "/api/products/" + productId + "/release";
        try {
            restTemplate.postForEntity(url, new StockReservationRequest(quantity), Object.class);
        } catch (Exception e) {
            log.error("Stock release compensating action failed for product ID {}: {}", productId, e.getMessage());
        }
    }
}
