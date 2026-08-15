package com.minicrm.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsDTO {
    private long totalLeads;
    private long totalContacts;
    private long followUpsToday;
    private long tasksPending;
    private long overdueTasks;
    private long dealsWon;
    private long dealsLost;
    private double totalRevenue;
    private Map<String, Long> leadsByStage; // pipeline funnel counts
    private Map<String, Long> leadsBySource;
    private Map<String, Long> leadsByStatus;
    private List<Map<String, Object>> upcomingFollowUps;
}
