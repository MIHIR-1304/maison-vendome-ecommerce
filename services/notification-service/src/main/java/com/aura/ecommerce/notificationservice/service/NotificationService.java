package com.aura.ecommerce.notificationservice.service;

import com.aura.ecommerce.notificationservice.dto.EventNotificationRequest;
import com.aura.ecommerce.notificationservice.dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    NotificationDto processEvent(EventNotificationRequest request);
    List<NotificationDto> getAllNotifications();
}
