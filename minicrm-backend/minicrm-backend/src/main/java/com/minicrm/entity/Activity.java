package com.minicrm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type; // CALL, EMAIL, MEETING, NOTE, TASK, LEAD_CREATED, STAGE_CHANGE

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @ManyToOne
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ActivityType {
        CALL, EMAIL, MEETING, NOTE, TASK, LEAD_CREATED, STAGE_CHANGE, DEAL_CREATED, SYSTEM
    }
}
