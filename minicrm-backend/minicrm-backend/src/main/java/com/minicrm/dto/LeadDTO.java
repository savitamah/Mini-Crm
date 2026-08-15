package com.minicrm.dto;

import com.minicrm.entity.Lead;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class LeadDTO {
    private Long id;
    private String name;
    private String company;
    private String email;
    private String phone;
    private String source;
    private Lead.LeadStatus status;
    private Double estimatedValue;
    private Integer score;
    private Long assignedToId;
    private String assignedToName;
    private LocalDateTime createdAt;
}
