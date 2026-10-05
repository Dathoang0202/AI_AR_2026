package com.vietphucstudio.service;

import com.vietphucstudio.dto.CulturalValidationResponse.CulturalSourceDto;
import com.vietphucstudio.entity.CulturalItem;
import com.vietphucstudio.repository.CulturalItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class CulturalKnowledgeService {

    private static final Set<String> STOP_WORDS = Set.of(
            "ao", "la", "ve", "cho", "toi", "ban", "cua", "co", "the", "nao",
            "nhung", "mot", "voi", "khi", "nen", "hay", "gi", "duoc", "mac", "phoi",
            "do", "tim", "hieu", "hoi", "biet", "trang", "phuc", "viet", "nam");

    private final CulturalItemRepository repository;

    public CulturalKnowledgeService(CulturalItemRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CulturalItem> retrieveRelevantKnowledge(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        String normalizedQuery = normalize(query);
        List<String> terms = Arrays.stream(normalizedQuery.split("\\s+"))
                .filter(term -> term.length() >= 3 && !STOP_WORDS.contains(term))
                .distinct()
                .toList();
        if (terms.isEmpty()) {
            return List.of();
        }

        List<ScoredItem> ranked = repository.findAll().stream()
                .map(item -> new ScoredItem(item, score(item, normalizedQuery, terms)))
                .filter(result -> result.score() > 0)
                .sorted(Comparator.comparingInt(ScoredItem::score).reversed()
                        .thenComparing(result -> result.item().getName()))
                .toList();
        if (ranked.isEmpty()) return List.of();
        int minimumScore = Math.max(1, ranked.get(0).score() / 2);
        return ranked.stream()
                .filter(result -> result.score() >= minimumScore)
                .limit(4)
                .map(ScoredItem::item)
                .toList();
    }

    private int score(CulturalItem item, String query, List<String> terms) {
        String name = normalize(item.getName());
        String details = normalize(String.join(" ",
                item.getDescription(),
                item.getSignificance() == null ? "" : item.getSignificance(),
                item.getRegion() == null ? "" : item.getRegion(),
                item.getHistoricalPeriod() == null ? "" : item.getHistoricalPeriod()));
        int score = query.contains(name) ? 12 : 0;
        for (String term : terms) {
            if (name.contains(term)) score += 5;
            else if (details.contains(term)) score += 1;
        }
        return score;
    }

    private String normalize(String value) {
        return Normalizer.normalize(value.toLowerCase(java.util.Locale.ROOT).replace('đ', 'd'), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
    }

    private record ScoredItem(CulturalItem item, int score) {}

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
