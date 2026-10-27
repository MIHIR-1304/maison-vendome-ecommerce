package com.aura.ecommerce.notificationservice.dto;

import com.aura.ecommerce.notificationservice.entity.Notification;
import java.time.Instant;

public class NotificationDto {
    private Long id;
    private String eventId;
    private String eventType;
    private String recipient;
    private String subject;
    private String content;
    private String status;
    private Instant createdAt;

    public NotificationDto() {}

    public static NotificationDto fromEntity(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setEventId(n.getEventId());
        dto.setEventType(n.getEventType());
        dto.setRecipient(n.getRecipient());
        dto.setSubject(n.getSubject());
        dto.setContent(n.getContent());
        dto.setStatus(n.getStatus());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
