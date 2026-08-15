package com.minicrm.service;

import com.minicrm.dto.TaskDTO;
import com.minicrm.entity.Task;
import com.minicrm.repository.ContactRepository;
import com.minicrm.repository.LeadRepository;
import com.minicrm.repository.TaskRepository;
import com.minicrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;

    public List<TaskDTO> list() {
        return taskRepository.findAll().stream().map(this::toDTO).toList();
    }

    public TaskDTO create(TaskDTO dto) {
        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .dueDate(dto.getDueDate())
                .priority(dto.getPriority() != null ? dto.getPriority() : Task.Priority.MEDIUM)
                .status(dto.getStatus() != null ? dto.getStatus() : Task.TaskStatus.PENDING)
                .build();
        if (dto.getAssignedToId() != null) userRepository.findById(dto.getAssignedToId()).ifPresent(task::setAssignedTo);
        if (dto.getRelatedLeadId() != null) leadRepository.findById(dto.getRelatedLeadId()).ifPresent(task::setRelatedLead);
        if (dto.getRelatedContactId() != null) contactRepository.findById(dto.getRelatedContactId()).ifPresent(task::setRelatedContact);
        return toDTO(taskRepository.save(task));
    }

    public TaskDTO update(Long id, TaskDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setDueDate(dto.getDueDate());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getAssignedToId() != null) userRepository.findById(dto.getAssignedToId()).ifPresent(task::setAssignedTo);
        return toDTO(taskRepository.save(task));
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskDTO toDTO(Task t) {
        return TaskDTO.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .dueDate(t.getDueDate())
                .priority(t.getPriority())
                .status(t.getStatus())
                .assignedToId(t.getAssignedTo() != null ? t.getAssignedTo().getId() : null)
                .assignedToName(t.getAssignedTo() != null ? t.getAssignedTo().getName() : null)
                .relatedLeadId(t.getRelatedLead() != null ? t.getRelatedLead().getId() : null)
                .relatedContactId(t.getRelatedContact() != null ? t.getRelatedContact().getId() : null)
                .build();
    }
}
