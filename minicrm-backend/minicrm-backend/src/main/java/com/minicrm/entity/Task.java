package com.minicrm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskStatus status = TaskStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "related_lead_id")
    private Lead relatedLead;

    @ManyToOne
    @JoinColumn(name = "related_contact_id")
    private Contact relatedContact;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    public enum TaskStatus {
        PENDING, IN_PROGRESS, COMPLETED
    }
}
