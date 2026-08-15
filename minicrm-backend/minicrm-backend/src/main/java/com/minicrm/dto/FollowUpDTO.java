package com.minicrm.dto;

import com.minicrm.entity.FollowUp;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class FollowUpDTO {
    private Long id;
    private String title;
    private Long leadId;
    private String leadName;
    private Long contactId;
    private String contactName;
    private FollowUp.ActivityType activityType;
    private LocalDate followUpDate;
    private LocalTime followUpTime;
    private String reminderOffset;
    private String notes;
    private FollowUp.FollowUpStatus status;
    private Long assignedToId;
}
