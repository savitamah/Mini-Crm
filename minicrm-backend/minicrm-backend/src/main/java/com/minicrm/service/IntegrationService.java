package com.minicrm.service;

import com.minicrm.dto.IntegrationDTO;
import com.minicrm.entity.Integration;
import com.minicrm.entity.User;
import com.minicrm.repository.IntegrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IntegrationService {

    private final IntegrationRepository integrationRepository;

    /** Known providers surfaced in the Settings > Integrations panel, keyed by provider slug -> display name. */
    private static final Map<String, String> KNOWN_PROVIDERS = new LinkedHashMap<>();

    static {
        KNOWN_PROVIDERS.put("gmail", "Gmail");
        KNOWN_PROVIDERS.put("google_calendar", "Google Calendar");
        KNOWN_PROVIDERS.put("whatsapp", "WhatsApp");
        KNOWN_PROVIDERS.put("mailchimp", "Mailchimp");
        KNOWN_PROVIDERS.put("zapier", "Zapier");
        KNOWN_PROVIDERS.put("slack", "Slack");
    }

    @Transactional
    public List<IntegrationDTO> list() {
        ensureSeeded();
        return integrationRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public IntegrationDTO connect(String provider, String credential, User actor) {
        Integration integration = findOrCreate(provider);
        integration.setConnected(true);
        integration.setCredential(credential);
        integration.setConnectedAt(LocalDateTime.now());
        integration.setConnectedBy(actor);
        return toDto(integrationRepository.save(integration));
    }

    @Transactional
    public IntegrationDTO disconnect(String provider) {
        Integration integration = integrationRepository.findByProvider(provider)
                .orElseThrow(() -> new IllegalArgumentException("Unknown integration: " + provider));
        integration.setConnected(false);
        integration.setCredential(null);
        integration.setConnectedAt(null);
        integration.setConnectedBy(null);
        return toDto(integrationRepository.save(integration));
    }

    /** Creates rows for any known provider that doesn't exist yet, so the list is always complete. */
    private void ensureSeeded() {
        KNOWN_PROVIDERS.forEach((slug, name) -> {
            if (integrationRepository.findByProvider(slug).isEmpty()) {
                integrationRepository.save(Integration.builder()
                        .provider(slug)
                        .name(name)
                        .connected(false)
                        .build());
            }
        });
    }

    private Integration findOrCreate(String provider) {
        return integrationRepository.findByProvider(provider).orElseGet(() -> {
            String name = KNOWN_PROVIDERS.getOrDefault(provider, provider);
            return Integration.builder().provider(provider).name(name).connected(false).build();
        });
    }

    private IntegrationDTO toDto(Integration integration) {
        return IntegrationDTO.builder()
                .id(integration.getId())
                .provider(integration.getProvider())
                .name(integration.getName())
                .connected(integration.isConnected())
                .connectedAt(integration.getConnectedAt())
                .connectedByName(integration.getConnectedBy() != null ? integration.getConnectedBy().getName() : null)
                .maskedCredential(mask(integration.getCredential()))
                .build();
    }

    private String mask(String value) {
        if (value == null || value.isBlank()) return null;
        if (value.length() <= 6) return "••••••";
        return value.substring(0, 3) + "••••" + value.substring(value.length() - 3);
    }
}
