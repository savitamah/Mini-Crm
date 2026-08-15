package com.minicrm.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntegrationDTO {
    private Long id;
    private String provider;
    private String name;
    private boolean connected;
    private LocalDateTime connectedAt;
    private String connectedByName;
    /** Masked credential, e.g. "AIz••••X9k". Never the raw value. */
    private String maskedCredential;
}
