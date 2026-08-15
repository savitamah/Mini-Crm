package com.minicrm.service;

import com.minicrm.dto.FollowUpDTO;
import com.minicrm.entity.Activity;
import com.minicrm.entity.FollowUp;
import com.minicrm.repository.ContactRepository;
import com.minicrm.repository.FollowUpRepository;
import com.minicrm.repository.LeadRepository;
import com.minicrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;

    public List<FollowUpDTO> list() {
        return followUpRepository.findAll().stream().map(this::toDTO).toList();
    }

    public List<FollowUpDTO> today() {
        return followUpRepository.findByFollowUpDate(LocalDate.now()).stream().map(this::toDTO).toList();
    }

    public List<FollowUpDTO> range(LocalDate start, LocalDate end) {
        return followUpRepository.findByFollowUpDateBetween(start, end).stream().map(this::toDTO).toList();
    }

    public FollowUpDTO create(FollowUpDTO dto) {
        FollowUp followUp = FollowUp.builder()
                .title(dto.getTitle())
                .activityType(dto.getActivityType() != null ? dto.getActivityType() : FollowUp.ActivityType.CALL)
                .followUpDate(dto.getFollowUpDate())
                .followUpTime(dto.getFollowUpTime())
                .reminderOffset(dto.getReminderOffset())
                .notes(dto.getNotes())
                .status(dto.getStatus() != null ? dto.getStatus() : FollowUp.FollowUpStatus.PENDING)
                .build();
        if (dto.getLeadId() != null) leadRepository.findById(dto.getLeadId()).ifPresent(followUp::setLead);
        if (dto.getContactId() != null) contactRepository.findById(dto.getContactId()).ifPresent(followUp::setContact);
        if (dto.getAssignedToId() != null) userRepository.findById(dto.getAssignedToId()).ifPresent(followUp::setAssignedTo);

        followUp = followUpRepository.save(followUp);

        activityService.log(Activity.ActivityType.valueOf(followUp.getActivityType().name().equals("NOTE") ? "NOTE" :
                        followUp.getActivityType().name()),
                "Follow-up scheduled: " + followUp.getTitle(),
                dto.getLeadId(), dto.getContactId(), null);

        return toDTO(followUp);
    }

    public FollowUpDTO update(Long id, FollowUpDTO dto) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Follow-up not found"));
        followUp.setTitle(dto.getTitle());
        if (dto.getActivityType() != null) followUp.setActivityType(dto.getActivityType());
        followUp.setFollowUpDate(dto.getFollowUpDate());
        followUp.setFollowUpTime(dto.getFollowUpTime());
        followUp.setReminderOffset(dto.getReminderOffset());
        followUp.setNotes(dto.getNotes());
        if (dto.getStatus() != null) followUp.setStatus(dto.getStatus());
        return toDTO(followUpRepository.save(followUp));
    }

    public void delete(Long id) {
        followUpRepository.deleteById(id);
    }

    private FollowUpDTO toDTO(FollowUp f) {
        return FollowUpDTO.builder()
                .id(f.getId())
                .title(f.getTitle())
                .leadId(f.getLead() != null ? f.getLead().getId() : null)
                .leadName(f.getLead() != null ? f.getLead().getName() : null)
                .contactId(f.getContact() != null ? f.getContact().getId() : null)
                .contactName(f.getContact() != null ? f.getContact().getName() : null)
                .activityType(f.getActivityType())
                .followUpDate(f.getFollowUpDate())
                .followUpTime(f.getFollowUpTime())
                .reminderOffset(f.getReminderOffset())
                .notes(f.getNotes())
                .status(f.getStatus())
                .assignedToId(f.getAssignedTo() != null ? f.getAssignedTo().getId() : null)
                .build();
    }
}
