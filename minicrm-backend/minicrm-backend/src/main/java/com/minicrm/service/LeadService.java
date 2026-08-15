package com.minicrm.service;

import com.minicrm.dto.LeadDTO;
import com.minicrm.entity.Activity;
import com.minicrm.entity.Lead;
import com.minicrm.entity.User;
import com.minicrm.repository.LeadRepository;
import com.minicrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;

    public List<LeadDTO> list() {
        return leadRepository.findAll().stream().map(this::toDTO).toList();
    }

    public LeadDTO get(Long id) {
        return toDTO(findEntity(id));
    }

    public LeadDTO create(LeadDTO dto) {
        Lead lead = Lead.builder()
                .name(dto.getName())
                .company(dto.getCompany())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .source(dto.getSource())
                .status(dto.getStatus() != null ? dto.getStatus() : Lead.LeadStatus.NEW)
                .estimatedValue(dto.getEstimatedValue())
                .score(dto.getScore() != null ? dto.getScore() : 0)
                .build();
        if (dto.getAssignedToId() != null) {
            userRepository.findById(dto.getAssignedToId()).ifPresent(lead::setAssignedTo);
        }
        lead = leadRepository.save(lead);
        activityService.log(Activity.ActivityType.LEAD_CREATED, "Lead created from " +
                (lead.getSource() != null ? lead.getSource() : "manual entry") + ".", lead.getId(), null, null);
        return toDTO(lead);
    }

    public LeadDTO update(Long id, LeadDTO dto) {
        Lead lead = findEntity(id);
        boolean stageChanged = dto.getStatus() != null && dto.getStatus() != lead.getStatus();
        Lead.LeadStatus oldStatus = lead.getStatus();

        lead.setName(dto.getName());
        lead.setCompany(dto.getCompany());
        lead.setEmail(dto.getEmail());
        lead.setPhone(dto.getPhone());
        lead.setSource(dto.getSource());
        if (dto.getStatus() != null) lead.setStatus(dto.getStatus());
        lead.setEstimatedValue(dto.getEstimatedValue());
        if (dto.getScore() != null) lead.setScore(dto.getScore());
        if (dto.getAssignedToId() != null) {
            userRepository.findById(dto.getAssignedToId()).ifPresent(lead::setAssignedTo);
        }
        lead = leadRepository.save(lead);

        if (stageChanged) {
            activityService.log(Activity.ActivityType.STAGE_CHANGE,
                    "Stage moved from " + oldStatus + " to " + lead.getStatus() + ".", lead.getId(), null, null);
        }
        return toDTO(lead);
    }

    // Dedicated endpoint for Kanban drag-and-drop stage updates
    public LeadDTO updateStatus(Long id, Lead.LeadStatus newStatus) {
        Lead lead = findEntity(id);
        Lead.LeadStatus oldStatus = lead.getStatus();
        lead.setStatus(newStatus);
        lead = leadRepository.save(lead);
        activityService.log(Activity.ActivityType.STAGE_CHANGE,
                "Stage moved from " + oldStatus + " to " + newStatus + ".", lead.getId(), null, null);
        return toDTO(lead);
    }

    public void delete(Long id) {
        leadRepository.deleteById(id);
    }

    private Lead findEntity(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));
    }

    private LeadDTO toDTO(Lead l) {
        return LeadDTO.builder()
                .id(l.getId())
                .name(l.getName())
                .company(l.getCompany())
                .email(l.getEmail())
                .phone(l.getPhone())
                .source(l.getSource())
                .status(l.getStatus())
                .estimatedValue(l.getEstimatedValue())
                .score(l.getScore())
                .assignedToId(l.getAssignedTo() != null ? l.getAssignedTo().getId() : null)
                .assignedToName(l.getAssignedTo() != null ? l.getAssignedTo().getName() : null)
                .createdAt(l.getCreatedAt())
                .build();
    }
}
