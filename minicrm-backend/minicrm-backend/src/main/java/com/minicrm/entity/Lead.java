package com.minicrm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String company;

    private String email;

    private String phone;

    private String source; // Website, Referral, Social Media, Other

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LeadStatus status = LeadStatus.NEW;

    private Double estimatedValue;

    @Builder.Default
    private Integer score = 0;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum LeadStatus {
        NEW, CONTACTED, INTERESTED, FOLLOW_UP, PROPOSAL, WON, LOST
    }
}
