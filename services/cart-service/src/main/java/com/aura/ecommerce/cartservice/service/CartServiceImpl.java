package com.aura.ecommerce.cartservice.service;

import com.aura.ecommerce.cartservice.client.ProductServiceClient;
import com.aura.ecommerce.cartservice.dto.*;
import com.aura.ecommerce.cartservice.entity.Cart;
import com.aura.ecommerce.cartservice.entity.CartItem;
import com.aura.ecommerce.cartservice.repository.CartItemRepository;
import com.aura.ecommerce.cartservice.repository.CartRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductServiceClient productServiceClient;

    public CartServiceImpl(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductServiceClient productServiceClient) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productServiceClient = productServiceClient;
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(new Cart(userId)));
    }

    @Override
    public CartDto getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return buildCartDto(cart);
    }

    @Override
    public CartDto addItem(Long userId, AddToCartRequest request) {
        if (request.getQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
        }

        Cart cart = getOrCreateCart(userId);
        Optional<ProductRefDto> productOpt = productServiceClient.getProductById(request.getProductId());

        if (productOpt.isPresent()) {
            ProductRefDto product = productOpt.get();
            if (Boolean.FALSE.equals(product.getActive())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is currently inactive");
            }
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), request.getProductId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(cart, request.getProductId(), request.getQuantity());
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return buildCartDto(cart);
    }

    @Override
    public CartDto updateItem(Long userId, Long productId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not in cart: " + productId));

        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
        }

        return buildCartDto(cart);
    }

    @Override
    public CartDto removeItem(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .ifPresent(item -> {
                    cart.getItems().remove(item);
                    cartItemRepository.delete(item);
                });

        return buildCartDto(cart);
    }

    @Override
    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cartItemRepository.deleteByCartId(cart.getId());
        });
    }

    private CartDto buildCartDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setCartId(cart.getId());
        dto.setUserId(cart.getUserId());

        List<CartItemDto> itemDtos = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalQuantity = 0;

        for (CartItem item : cart.getItems()) {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setId(item.getId());
            itemDto.setProductId(item.getProductId());
            itemDto.setQuantity(item.getQuantity());

            Optional<ProductRefDto> productOpt = productServiceClient.getProductById(item.getProductId());

            if (productOpt.isPresent()) {
                ProductRefDto product = productOpt.get();
                itemDto.setProductName(product.getName());
                itemDto.setProductSlug(product.getSlug());
                itemDto.setImageUrl(product.getImageUrl());
                itemDto.setUnitPrice(product.getPrice());
                itemDto.setAvailableStock(product.getStockQuantity());

                BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                itemDto.setLineTotal(lineTotal);
                subtotal = subtotal.add(lineTotal);
            } else {
                // Fallback display if Product Service is unavailable
                itemDto.setProductName("Item #" + item.getProductId());
                itemDto.setUnitPrice(BigDecimal.ZERO);
                itemDto.setLineTotal(BigDecimal.ZERO);
                itemDto.setAvailableStock(99);
            }

            totalQuantity += item.getQuantity();
            itemDtos.add(itemDto);
        }

        dto.setItems(itemDtos);
        dto.setTotalItems(totalQuantity);
        dto.setSubtotal(subtotal);

        return dto;
    }
}
