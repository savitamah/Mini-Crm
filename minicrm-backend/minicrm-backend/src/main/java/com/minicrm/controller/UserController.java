package com.minicrm.controller;

import com.minicrm.dto.UserDTO;
import com.minicrm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> list() {
        return ResponseEntity.ok(userService.list());
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody Map<String, Object> body) {
        UserDTO dto = UserDTO.builder()
                .name((String) body.get("name"))
                .email((String) body.get("email"))
                .role(body.get("role") != null ?
                        com.minicrm.entity.User.RoleType.valueOf((String) body.get("role")) : null)
                .build();
        String password = (String) body.getOrDefault("password", "changeme123");
        return ResponseEntity.ok(userService.create(dto, password));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
