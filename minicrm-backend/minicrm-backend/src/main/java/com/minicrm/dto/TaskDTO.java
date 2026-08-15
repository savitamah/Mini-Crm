package com.minicrm.dto;

import com.minicrm.entity.Task;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Task.Priority priority;
    private Task.TaskStatus status;
    private Long assignedToId;
    private String assignedToName;
    private Long relatedLeadId;
    private Long relatedContactId;
}
