package com.minicrm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "integrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Integration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Stable slug, e.g. "gmail", "google_calendar", "whatsapp", "mailchimp", "zapier", "slack" */
    @Column(nullable = false, unique = true)
    private String provider;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private boolean connected = false;

    /**
     * Raw credential/API key/webhook URL supplied by the user. In a real deployment this should be
     * encrypted at rest (e.g. via a JPA AttributeConverter) — kept plain here to match the project's
     * current scope, but never returned as-is from the API (see IntegrationDTO, which only exposes
     * a masked version).
     */
    @Column(length = 2000)
    private String credential;

    private LocalDateTime connectedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connected_by")
    private User connectedBy;
}
