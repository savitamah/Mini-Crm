package com.minicrm.dto;

import com.minicrm.entity.Deal;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class DealDTO {
    private Long id;
    private String dealName;
    private Long contactId;
    private String contactName;
    private Deal.DealStage stage;
    private Double amount;
    private LocalDate expectedCloseDate;
    private Integer probability;
    private Long ownerId;
    private String ownerName;
}
