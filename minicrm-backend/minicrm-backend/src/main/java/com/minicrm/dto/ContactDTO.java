package com.minicrm.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ContactDTO {
    private Long id;
    private String name;
    private String company;
    private String email;
    private String phone;
    private String tags;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
}
