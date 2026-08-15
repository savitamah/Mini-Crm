package com.minicrm.service;

import com.minicrm.dto.DealDTO;
import com.minicrm.entity.Contact;
import com.minicrm.entity.Deal;
import com.minicrm.repository.ContactRepository;
import com.minicrm.repository.DealRepository;
import com.minicrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public List<DealDTO> list() {
        return dealRepository.findAll().stream().map(this::toDTO).toList();
    }

    public DealDTO create(DealDTO dto) {
        Deal deal = Deal.builder()
                .dealName(dto.getDealName())
                .stage(dto.getStage() != null ? dto.getStage() : Deal.DealStage.QUALIFICATION)
                .amount(dto.getAmount())
                .expectedCloseDate(dto.getExpectedCloseDate())
                .probability(dto.getProbability() != null ? dto.getProbability() : 20)
                .build();
        if (dto.getContactId() != null) {
            contactRepository.findById(dto.getContactId()).ifPresent(deal::setContact);
        }
        if (dto.getOwnerId() != null) {
            userRepository.findById(dto.getOwnerId()).ifPresent(deal::setOwner);
        }
        return toDTO(dealRepository.save(deal));
    }

    public DealDTO update(Long id, DealDTO dto) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Deal not found"));
        deal.setDealName(dto.getDealName());
        if (dto.getStage() != null) deal.setStage(dto.getStage());
        deal.setAmount(dto.getAmount());
        deal.setExpectedCloseDate(dto.getExpectedCloseDate());
        if (dto.getProbability() != null) deal.setProbability(dto.getProbability());
        if (dto.getContactId() != null) {
            contactRepository.findById(dto.getContactId()).ifPresent(deal::setContact);
        }
        return toDTO(dealRepository.save(deal));
    }

    public void delete(Long id) {
        dealRepository.deleteById(id);
    }

    private DealDTO toDTO(Deal d) {
        return DealDTO.builder()
                .id(d.getId())
                .dealName(d.getDealName())
                .contactId(d.getContact() != null ? d.getContact().getId() : null)
                .contactName(d.getContact() != null ? d.getContact().getName() : null)
                .stage(d.getStage())
                .amount(d.getAmount())
                .expectedCloseDate(d.getExpectedCloseDate())
                .probability(d.getProbability())
                .ownerId(d.getOwner() != null ? d.getOwner().getId() : null)
                .ownerName(d.getOwner() != null ? d.getOwner().getName() : null)
                .build();
    }
}
