package com.minicrm.config;

import com.minicrm.entity.*;
import com.minicrm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User admin = userRepository.save(User.builder()
                .name("John Doe")
                .email("admin@minicrm.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.RoleType.ADMIN)
                .status(User.UserStatus.ACTIVE)
                .build());

        userRepository.save(User.builder()
                .name("Jane Smith")
                .email("jane@minicrm.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.RoleType.MANAGER)
                .status(User.UserStatus.ACTIVE)
                .build());

        userRepository.save(User.builder()
                .name("Mike Johnson")
                .email("mike@minicrm.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.RoleType.SALES_REP)
                .status(User.UserStatus.ACTIVE)
                .build());

        Contact c1 = contactRepository.save(Contact.builder()
                .name("Rahul Sharma").company("ABC Pvt Ltd").email("rahul@abc.com")
                .phone("9876543210").tags("Client,Hot").owner(admin).build());

        contactRepository.save(Contact.builder()
                .name("Neha Singh").company("Tech Solutions").email("neha@tech.com")
                .phone("9888776655").tags("Partner").owner(admin).build());

        leadRepository.save(Lead.builder()
                .name("Deepak Yadav").company("DY Solutions").email("deepak@dysolutions.com")
                .phone("9876543210").source("Website").status(Lead.LeadStatus.INTERESTED)
                .estimatedValue(15000.0).score(75).assignedTo(admin).build());

        leadRepository.save(Lead.builder()
                .name("Sandeep Raj").company("SR Enterprises").source("Referral")
                .status(Lead.LeadStatus.NEW).estimatedValue(8000.0).score(40).assignedTo(admin).build());

        dealRepository.save(Deal.builder()
                .dealName("Premium Package").contact(c1).stage(Deal.DealStage.PROPOSAL)
                .amount(10000.0).expectedCloseDate(LocalDate.now().plusDays(10))
                .probability(70).owner(admin).build());

        System.out.println("=== Mini CRM demo data seeded ===");
        System.out.println("Login: admin@minicrm.com / admin123");
    }
}
