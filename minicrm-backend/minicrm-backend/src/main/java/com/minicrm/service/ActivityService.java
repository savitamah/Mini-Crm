package com.minicrm.service;

import com.minicrm.dto.ActivityDTO;
import com.minicrm.entity.Activity;
import com.minicrm.entity.Contact;
import com.minicrm.entity.Lead;
import com.minicrm.repository.ActivityRepository;
import com.minicrm.repository.ContactRepository;
import com.minicrm.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;

    public Activity log(Activity.ActivityType type, String description, Long leadId, Long contactId, Long performedById) {
        Activity.ActivityBuilder builder = Activity.builder()
                .type(type)
                .description(description);
        if (leadId != null) {
            leadRepository.findById(leadId).ifPresent(builder::lead);
        }
        if (contactId != null) {
            contactRepository.findById(contactId).ifPresent(builder::contact);
        }
        return activityRepository.save(builder.build());
    }

    public List<ActivityDTO> listAll() {
        return activityRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDTO).toList();
    }

    public List<ActivityDTO> listForLead(Long leadId) {
        return activityRepository.findByLeadIdOrderByCreatedAtDesc(leadId).stream().map(this::toDTO).toList();
    }

    private ActivityDTO toDTO(Activity a) {
        return ActivityDTO.builder()
                .id(a.getId())
                .type(a.getType())
                .description(a.getDescription())
                .leadId(a.getLead() != null ? a.getLead().getId() : null)
                .contactId(a.getContact() != null ? a.getContact().getId() : null)
                .performedByName(a.getPerformedBy() != null ? a.getPerformedBy().getName() : "System")
                .createdAt(a.getCreatedAt())
                .build();
    }
}
