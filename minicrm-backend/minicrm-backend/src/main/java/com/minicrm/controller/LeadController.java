package com.minicrm.controller;

import com.minicrm.dto.LeadDTO;
import com.minicrm.entity.Lead;
import com.minicrm.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<List<LeadDTO>> list() {
        return ResponseEntity.ok(leadService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.get(id));
    }

    @PostMapping
    public ResponseEntity<LeadDTO> create(@RequestBody LeadDTO dto) {
        return ResponseEntity.ok(leadService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadDTO> update(@PathVariable Long id, @RequestBody LeadDTO dto) {
        return ResponseEntity.ok(leadService.update(id, dto));
    }

    // Used by the Kanban board for drag-and-drop stage changes
    @PatchMapping("/{id}/status")
    public ResponseEntity<LeadDTO> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Lead.LeadStatus status = Lead.LeadStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(leadService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
