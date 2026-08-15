package com.minicrm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IntegrationConnectRequest {
    @NotBlank(message = "credential is required")
    private String credential;
}
