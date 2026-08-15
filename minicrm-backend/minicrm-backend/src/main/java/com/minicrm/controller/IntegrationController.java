package com.minicrm.controller;

import com.minicrm.dto.IntegrationConnectRequest;
import com.minicrm.dto.IntegrationDTO;
import com.minicrm.entity.User;
import com.minicrm.repository.UserRepository;
import com.minicrm.service.IntegrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/integrations")
@RequiredArgsConstructor
public class IntegrationController {

    private final IntegrationService integrationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<IntegrationDTO>> list() {
        return ResponseEntity.ok(integrationService.list());
    }

    @PostMapping("/{provider}/connect")
    public ResponseEntity<IntegrationDTO> connect(@PathVariable String provider,
                                                    @Valid @RequestBody IntegrationConnectRequest request,
                                                    Authentication authentication) {
        User actor = currentUser(authentication);
        return ResponseEntity.ok(integrationService.connect(provider, request.getCredential(), actor));
    }

    @DeleteMapping("/{provider}")
    public ResponseEntity<IntegrationDTO> disconnect(@PathVariable String provider) {
        return ResponseEntity.ok(integrationService.disconnect(provider));
    }

    private User currentUser(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }
}
