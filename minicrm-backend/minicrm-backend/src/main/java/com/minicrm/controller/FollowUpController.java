package com.minicrm.controller;

import com.minicrm.dto.FollowUpDTO;
import com.minicrm.service.FollowUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/follow-ups")
@RequiredArgsConstructor
public class FollowUpController {

    private final FollowUpService followUpService;

    @GetMapping
    public ResponseEntity<List<FollowUpDTO>> list() {
        return ResponseEntity.ok(followUpService.list());
    }

    @GetMapping("/today")
    public ResponseEntity<List<FollowUpDTO>> today() {
        return ResponseEntity.ok(followUpService.today());
    }

    @GetMapping("/range")
    public ResponseEntity<List<FollowUpDTO>> range(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(followUpService.range(start, end));
    }

    @PostMapping
    public ResponseEntity<FollowUpDTO> create(@RequestBody FollowUpDTO dto) {
        return ResponseEntity.ok(followUpService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FollowUpDTO> update(@PathVariable Long id, @RequestBody FollowUpDTO dto) {
        return ResponseEntity.ok(followUpService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        followUpService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
