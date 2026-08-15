package com.minicrm.repository;

import com.minicrm.entity.Integration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IntegrationRepository extends JpaRepository<Integration, Long> {
    Optional<Integration> findByProvider(String provider);
}
