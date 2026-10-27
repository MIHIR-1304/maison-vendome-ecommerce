package com.aura.ecommerce.notificationservice.repository;

import com.aura.ecommerce.notificationservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Optional<Notification> findByEventId(String eventId);
    boolean existsByEventId(String eventId);
    List<Notification> findAllByOrderByCreatedAtDesc();
}
