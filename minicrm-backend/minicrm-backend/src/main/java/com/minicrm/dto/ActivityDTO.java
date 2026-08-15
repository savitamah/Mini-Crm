package com.minicrm.dto;

import com.minicrm.entity.Activity;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ActivityDTO {
    private Long id;
    private Activity.ActivityType type;
    private String description;
    private Long leadId;
    private Long contactId;
    private String performedByName;
    private LocalDateTime createdAt;
}
