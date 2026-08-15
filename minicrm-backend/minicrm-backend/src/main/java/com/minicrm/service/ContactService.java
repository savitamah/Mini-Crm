package com.minicrm.service;

import com.minicrm.dto.ContactDTO;
import com.minicrm.entity.Contact;
import com.minicrm.entity.User;
import com.minicrm.repository.ContactRepository;
import com.minicrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public Page<ContactDTO> list(String search, int page, int size) {
        String s = search == null ? "" : search;
        Page<Contact> contacts = contactRepository
                .findByNameContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        s, s, s, PageRequest.of(page, size));
        return contacts.map(this::toDTO);
    }

    public ContactDTO get(Long id) {
        return toDTO(contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found")));
    }

    public ContactDTO create(ContactDTO dto) {
        Contact contact = Contact.builder()
                .name(dto.getName())
                .company(dto.getCompany())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .tags(dto.getTags())
                .build();
        if (dto.getOwnerId() != null) {
            userRepository.findById(dto.getOwnerId()).ifPresent(contact::setOwner);
        }
        return toDTO(contactRepository.save(contact));
    }

    public ContactDTO update(Long id, ContactDTO dto) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found"));
        contact.setName(dto.getName());
        contact.setCompany(dto.getCompany());
        contact.setEmail(dto.getEmail());
        contact.setPhone(dto.getPhone());
        contact.setTags(dto.getTags());
        if (dto.getOwnerId() != null) {
            userRepository.findById(dto.getOwnerId()).ifPresent(contact::setOwner);
        }
        return toDTO(contactRepository.save(contact));
    }

    public void delete(Long id) {
        contactRepository.deleteById(id);
    }

    private ContactDTO toDTO(Contact c) {
        return ContactDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .company(c.getCompany())
                .email(c.getEmail())
                .phone(c.getPhone())
                .tags(c.getTags())
                .ownerId(c.getOwner() != null ? c.getOwner().getId() : null)
                .ownerName(c.getOwner() != null ? c.getOwner().getName() : null)
                .createdAt(c.getCreatedAt())
                .build();
    }
}
