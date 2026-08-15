package com.minicrm.repository;

import com.minicrm.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByLeadIdOrderByCreatedAtDesc(Long leadId);
    List<Activity> findAllByOrderByCreatedAtDesc();
}
