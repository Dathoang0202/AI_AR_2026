package com.vietphucstudio.service;

import com.vietphucstudio.dto.CulturalItemResponse;
import com.vietphucstudio.dto.CulturalSourceResponse;
import com.vietphucstudio.entity.CulturalItem;
import com.vietphucstudio.exception.ResourceNotFoundException;
import com.vietphucstudio.repository.CulturalItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CulturalItemService {

    private final CulturalItemRepository repository;

    public CulturalItemService(CulturalItemRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CulturalItemResponse> getAllItems(String category) {
        List<CulturalItem> items;
        if (category != null && !category.isBlank()) {
            items = repository.findByCategory(category.toUpperCase());
        } else {
            items = repository.findAll();
        }
        return items.stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public CulturalItemResponse getItemById(Long id) {
        CulturalItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tư liệu văn hóa"));
        return mapToResponse(item);
    }

    @Transactional(readOnly = true)
    public List<CulturalItemResponse> searchItems(String query) {
        if (query == null || query.isBlank()) {
            return getAllItems(null);
        }
        return repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CulturalItemResponse mapToResponse(CulturalItem item) {
        CulturalItemResponse res = new CulturalItemResponse();
        res.setId(item.getId());
        res.setName(item.getName());
        res.setCategory(item.getCategory());
        res.setRegion(item.getRegion());
        res.setHistoricalPeriod(item.getHistoricalPeriod());
        res.setDescription(item.getDescription());
        res.setSignificance(item.getSignificance());

        if (item.getSources() != null) {
            res.setSources(item.getSources().stream()
                    .map(s -> new CulturalSourceResponse(s.getId(), s.getTitle(), s.getPublisher(), s.getUrl()))
                    .toList());
        } else {
            res.setSources(List.of());
        }

        return res;
    }
}
