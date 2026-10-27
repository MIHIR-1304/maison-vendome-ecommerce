package com.aura.ecommerce.paymentservice.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Component
public class NotificationServiceClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceClient.class);

    private final RestTemplate restTemplate;
    private final String notificationServiceUrl;

    public NotificationServiceClient(
            RestTemplate restTemplate,
            @Value("${services.notification-service-url}") String notificationServiceUrl) {
        this.restTemplate = restTemplate;
        this.notificationServiceUrl = notificationServiceUrl;
    }

    public void dispatchEvent(String eventType, String recipient, String subject, Map<String, Object> payload) {
        String url = notificationServiceUrl + "/api/notifications/events";
        try {
            Map<String, Object> event = Map.of(
                    "eventId", UUID.randomUUID().toString(),
                    "eventType", eventType,
                    "recipient", recipient,
                    "subject", subject,
                    "payload", payload
            );
            restTemplate.postForEntity(url, event, Object.class);
            log.info("Dispatched domain event {} to {}", eventType, recipient);
        } catch (Exception e) {
            log.warn("Fail-safe: Notification event dispatch failed: {}", e.getMessage());
        }
    }
}
