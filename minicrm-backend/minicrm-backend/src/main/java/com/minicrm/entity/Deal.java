package com.minicrm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dealName;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DealStage stage = DealStage.QUALIFICATION;

    private Double amount;

    private LocalDate expectedCloseDate;

    @Builder.Default
    private Integer probability = 20;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum DealStage {
        QUALIFICATION, PROPOSAL, NEGOTIATION, WON, LOST
    }
}
