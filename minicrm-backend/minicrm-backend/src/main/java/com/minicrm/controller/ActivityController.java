package com.minicrm.controller;

import com.minicrm.dto.ActivityDTO;
import com.minicrm.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<ActivityDTO>> list() {
        return ResponseEntity.ok(activityService.listAll());
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<ActivityDTO>> forLead(@PathVariable Long leadId) {
        return ResponseEntity.ok(activityService.listForLead(leadId));
    }
}
