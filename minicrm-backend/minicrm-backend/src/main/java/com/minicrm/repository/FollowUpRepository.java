package com.minicrm.repository;

import com.minicrm.entity.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByFollowUpDate(LocalDate date);
    List<FollowUp> findByFollowUpDateBetween(LocalDate start, LocalDate end);
    List<FollowUp> findByStatus(FollowUp.FollowUpStatus status);
}
