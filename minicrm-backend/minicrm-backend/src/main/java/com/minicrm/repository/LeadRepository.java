package com.minicrm.repository;

import com.minicrm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStatus(Lead.LeadStatus status);
    List<Lead> findByNameContainingIgnoreCase(String name);
}
