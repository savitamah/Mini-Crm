package com.minicrm.service;

import com.minicrm.dto.DashboardStatsDTO;
import com.minicrm.entity.Deal;
import com.minicrm.entity.FollowUp;
import com.minicrm.entity.Lead;
import com.minicrm.entity.Task;
import com.minicrm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;
    private final DealRepository dealRepository;
    private final TaskRepository taskRepository;
    private final FollowUpRepository followUpRepository;

    public DashboardStatsDTO getStats() {
        List<Lead> leads = leadRepository.findAll();
        List<Deal> deals = dealRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        List<FollowUp> followUps = followUpRepository.findAll();

        long followUpsToday = followUps.stream()
                .filter(f -> f.getFollowUpDate() != null && f.getFollowUpDate().equals(LocalDate.now()))
                .count();

        long tasksPending = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.PENDING).count();
        long overdueTasks = tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now())
                        && t.getStatus() != Task.TaskStatus.COMPLETED)
                .count();

        long dealsWon = deals.stream().filter(d -> d.getStage() == Deal.DealStage.WON).count();
        long dealsLost = deals.stream().filter(d -> d.getStage() == Deal.DealStage.LOST).count();
        double totalRevenue = deals.stream()
                .filter(d -> d.getStage() == Deal.DealStage.WON)
                .mapToDouble(d -> d.getAmount() != null ? d.getAmount() : 0.0)
                .sum();

        Map<String, Long> leadsByStage = new LinkedHashMap<>();
        for (Lead.LeadStatus status : Lead.LeadStatus.values()) {
            leadsByStage.put(status.name(), leads.stream().filter(l -> l.getStatus() == status).count());
        }

        Map<String, Long> leadsBySource = leads.stream()
                .filter(l -> l.getSource() != null)
                .collect(Collectors.groupingBy(Lead::getSource, Collectors.counting()));

        Map<String, Long> leadsByStatus = leads.stream()
                .collect(Collectors.groupingBy(l -> l.getStatus().name(), Collectors.counting()));

        List<Map<String, Object>> upcoming = followUps.stream()
                .filter(f -> f.getFollowUpDate() != null && !f.getFollowUpDate().isBefore(LocalDate.now()))
                .sorted(Comparator.comparing(FollowUp::getFollowUpDate))
                .limit(5)
                .map(f -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", f.getId());
                    m.put("title", f.getTitle());
                    m.put("date", f.getFollowUpDate());
                    m.put("time", f.getFollowUpTime());
                    m.put("leadName", f.getLead() != null ? f.getLead().getName() : null);
                    return m;
                }).toList();

        return DashboardStatsDTO.builder()
                .totalLeads(leads.size())
                .totalContacts(contactRepository.count())
                .followUpsToday(followUpsToday)
                .tasksPending(tasksPending)
                .overdueTasks(overdueTasks)
                .dealsWon(dealsWon)
                .dealsLost(dealsLost)
                .totalRevenue(totalRevenue)
                .leadsByStage(leadsByStage)
                .leadsBySource(leadsBySource)
                .leadsByStatus(leadsByStatus)
                .upcomingFollowUps(upcoming)
                .build();
    }
}
