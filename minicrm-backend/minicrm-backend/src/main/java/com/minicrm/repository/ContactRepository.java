package com.minicrm.repository;

import com.minicrm.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    Page<Contact> findByNameContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name, String company, String email, Pageable pageable);
}
