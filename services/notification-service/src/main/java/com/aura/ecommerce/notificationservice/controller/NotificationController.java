package com.aura.ecommerce.notificationservice.controller;

import com.aura.ecommerce.notificationservice.dto.EventNotificationRequest;
import com.aura.ecommerce.notificationservice.dto.NotificationDto;
import com.aura.ecommerce.notificationservice.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification APIs", description = "Endpoints for domain event ingestion and customer notification delivery")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/events")
    @Operation(summary = "Ingest asynchronous domain event and dispatch notification")
    public ResponseEntity<NotificationDto> receiveEvent(@Valid @RequestBody EventNotificationRequest request) {
        NotificationDto notification = notificationService.processEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }

    @GetMapping("/events")
    @Operation(summary = "List all dispatched notifications (for admin and development inspection)")
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "notification-service"));
    }
}
