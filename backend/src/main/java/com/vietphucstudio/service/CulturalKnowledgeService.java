package com.vietphucstudio.service;

import com.vietphucstudio.dto.CulturalValidationResponse.CulturalSourceDto;
import com.vietphucstudio.entity.CulturalItem;
import com.vietphucstudio.repository.CulturalItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CulturalKnowledgeService {

    private final CulturalItemRepository repository;

    public CulturalKnowledgeService(CulturalItemRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CulturalItem> retrieveRelevantKnowledge(String query) {
        if (query == null || query.isBlank()) {
            return repository.findAll();
        }
        return repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public List<CulturalSourceDto> extractVerifiedSources(List<CulturalItem> items) {
        List<CulturalSourceDto> sources = new ArrayList<>();
        for (CulturalItem item : items) {
            if (item.getSources() != null) {
                item.getSources().forEach(s -> sources.add(new CulturalSourceDto(s.getTitle(), s.getPublisher(), s.getUrl())));
            }
        }
        return sources;
    }
}
