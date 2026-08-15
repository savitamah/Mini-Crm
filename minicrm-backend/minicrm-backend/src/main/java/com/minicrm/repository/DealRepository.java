package com.minicrm.repository;

import com.minicrm.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DealRepository extends JpaRepository<Deal, Long> {
    List<Deal> findByStage(Deal.DealStage stage);
}
