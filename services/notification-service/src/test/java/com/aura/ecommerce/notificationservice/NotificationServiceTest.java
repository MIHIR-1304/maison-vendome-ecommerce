package com.aura.ecommerce.notificationservice;

import com.aura.ecommerce.notificationservice.dto.EventNotificationRequest;
import com.aura.ecommerce.notificationservice.dto.NotificationDto;
import com.aura.ecommerce.notificationservice.service.NotificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Test
    @DisplayName("Should process domain event and persist notification")
    void shouldProcessDomainEvent() {
        String eventId = UUID.randomUUID().toString();
        EventNotificationRequest req = new EventNotificationRequest();
        req.setEventId(eventId);
        req.setEventType("ORDER_CREATED");
        req.setRecipient("customer@example.com");
        req.setSubject("Order Confirmation #ORD-123");
        req.setPayload(Map.of("totalAmount", "$299.00", "orderNumber", "ORD-123"));

        NotificationDto res = notificationService.processEvent(req);

        assertNotNull(res);
        assertEquals(eventId, res.getEventId());
        assertEquals("ORDER_CREATED", res.getEventType());
        assertEquals("DELIVERED", res.getStatus());
        assertTrue(res.getContent().contains("ORD-123"));

        // Idempotency: submitting the exact same event should return the existing record without duplicate
        NotificationDto duplicateRes = notificationService.processEvent(req);
        assertEquals(res.getId(), duplicateRes.getId());
    }
}
