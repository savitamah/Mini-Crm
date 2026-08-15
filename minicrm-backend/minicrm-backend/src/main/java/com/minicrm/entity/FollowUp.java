package com.minicrm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "follow_ups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ActivityType activityType = ActivityType.CALL;

    private LocalDate followUpDate;

    private LocalTime followUpTime;

    // e.g. "15 minutes before", "1 hour before", "1 day before"
    private String reminderOffset;

    private String notes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FollowUpStatus status = FollowUpStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ActivityType {
        CALL, EMAIL, MEETING, NOTE, TASK
    }

    public enum FollowUpStatus {
        PENDING, CONFIRMED, COMPLETED, OVERDUE, CANCELLED
    }
}
