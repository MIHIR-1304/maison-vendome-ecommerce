package com.aura.ecommerce.notificationservice.service;

import com.aura.ecommerce.notificationservice.dto.EventNotificationRequest;
import com.aura.ecommerce.notificationservice.dto.NotificationDto;
import com.aura.ecommerce.notificationservice.entity.Notification;
import com.aura.ecommerce.notificationservice.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;
    private final String fromEmail;
    private final boolean smtpEnabled;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            @Value("${notification.from-email:no-reply@aurastore.com}") String fromEmail,
            @Value("${notification.smtp.enabled:false}") boolean smtpEnabled) {
        this.notificationRepository = notificationRepository;
        this.fromEmail = fromEmail;
        this.smtpEnabled = smtpEnabled;
    }

    @Override
    public NotificationDto processEvent(EventNotificationRequest request) {
        String eventId = request.getEventId();
        if (eventId == null || eventId.isBlank()) {
            eventId = UUID.randomUUID().toString();
        }

        // Idempotency check: Ignore duplicate events
        if (notificationRepository.existsByEventId(eventId)) {
            log.info("Duplicate notification event ignored: {}", eventId);
            return notificationRepository.findByEventId(eventId)
                    .map(NotificationDto::fromEntity)
                    .orElse(null);
        }

        // Build human-readable email body
        StringBuilder body = new StringBuilder();
        body.append("From: ").append(fromEmail).append("\n");
        body.append("To: ").append(request.getRecipient()).append("\n");
        body.append("Event: ").append(request.getEventType()).append("\n");
        body.append("Subject: ").append(request.getSubject()).append("\n");
        body.append("Details:\n");

        if (request.getPayload() != null) {
            request.getPayload().forEach((k, v) -> body.append("  • ").append(k).append(": ").append(v).append("\n"));
        }

        String renderedContent = body.toString();

        // Log notification for local development & observability
        log.info("\n=======================================================\n" +
                 "[LOCAL NOTIFICATION DISPATCH]\n" +
                 "Event ID:  {}\n" +
                 "Type:      {}\n" +
                 "Recipient: {}\n" +
                 "Subject:   {}\n" +
                 "Status:    DELIVERED (Local Adapter)\n" +
                 "=======================================================\n",
                eventId, request.getEventType(), request.getRecipient(), request.getSubject());

        Notification notification = new Notification(
                eventId,
                request.getEventType(),
                request.getRecipient(),
                request.getSubject(),
                renderedContent,
                "DELIVERED"
        );

        Notification saved = notificationRepository.save(notification);
        return NotificationDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }
}
