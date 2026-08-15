package com.minicrm.dto;

import com.minicrm.entity.User;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private User.RoleType role;
    private User.UserStatus status;
}
