package com.minicrm.controller;

import com.minicrm.dto.ContactDTO;
import com.minicrm.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<Page<ContactDTO>> list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(contactService.list(search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.get(id));
    }

    @PostMapping
    public ResponseEntity<ContactDTO> create(@RequestBody ContactDTO dto) {
        return ResponseEntity.ok(contactService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDTO> update(@PathVariable Long id, @RequestBody ContactDTO dto) {
        return ResponseEntity.ok(contactService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
