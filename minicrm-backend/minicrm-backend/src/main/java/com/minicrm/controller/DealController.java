package com.minicrm.controller;

import com.minicrm.dto.DealDTO;
import com.minicrm.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @GetMapping
    public ResponseEntity<List<DealDTO>> list() {
        return ResponseEntity.ok(dealService.list());
    }

    @PostMapping
    public ResponseEntity<DealDTO> create(@RequestBody DealDTO dto) {
        return ResponseEntity.ok(dealService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealDTO> update(@PathVariable Long id, @RequestBody DealDTO dto) {
        return ResponseEntity.ok(dealService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dealService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
