package com.vietphucstudio.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vietphucstudio.dto.*;
import com.vietphucstudio.entity.Outfit;
import com.vietphucstudio.entity.CulturalItem;
import com.vietphucstudio.exception.BusinessRuleException;
import com.vietphucstudio.exception.ResourceNotFoundException;
import com.vietphucstudio.repository.OutfitRepository;
import com.vietphucstudio.repository.CulturalItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Comparator;
import java.util.Locale;
import java.util.ArrayList;
import static com.vietphucstudio.service.GarmentRules.normalized;

@Service
public class OutfitService {

    private static final Logger log = LoggerFactory.getLogger(OutfitService.class);

    private final OutfitRepository outfitRepository;
    private final ObjectMapper objectMapper;
    private final CulturalItemRepository culturalItemRepository;

    public OutfitService(OutfitRepository outfitRepository, ObjectMapper objectMapper,
                         CulturalItemRepository culturalItemRepository) {
        this.outfitRepository = outfitRepository;
        this.objectMapper = objectMapper;
        this.culturalItemRepository = culturalItemRepository;
    }

    @Transactional(readOnly = true)
    public List<OutfitRecommendationResponse> generateRecommendations(OutfitPreferenceRequest request) {
        List<CulturalItem> garments = culturalItemRepository.findByCategory("GARMENT");
        boolean male = "male".equals(request.getGender());
        if (request.getCulturalItemId() != null) {
            CulturalItem selected = garments.stream()
                    .filter(item -> item.getId().equals(request.getCulturalItemId())).findFirst()
                    .orElseThrow(() -> new BusinessRuleException("INVALID_GARMENT", "Y phục đã chọn không còn trong bảo tàng. Vui lòng chọn lại."));
            if (!supportsGender(selected, male)) {
                throw new BusinessRuleException("INCOMPATIBLE_GARMENT", "Y phục này đang được gợi ý cho ma-nơ-canh nữ. Hãy đổi ma-nơ-canh hoặc chọn y phục khác.");
            }
            garments = List.of(selected);
        }
        List<CulturalItem> accessoryCatalog = culturalItemRepository.findByCategory("ACCESSORY");
        List<String> colors = request.getPreferredColors() == null ? List.of() : request.getPreferredColors().stream()
                .filter(value -> value != null && !value.isBlank()).map(this::colorHex)
                .filter(value -> !value.isEmpty()).distinct().limit(8).toList();
        List<String> palette = colors.isEmpty() ? List.of("#C0392B", "#1E4D2B", "#FDFBF7") : colors;
        return garments.stream().filter(item -> supportsGender(item, male))
                .filter(item -> GarmentRules.supportsOccasion(item.getName(), request.getOccasion()))
                .sorted(Comparator.<CulturalItem>comparingInt(item -> recommendationScore(item, request)).reversed()
                        .thenComparing(CulturalItem::getId)).limit(3)
                .map(item -> {
                    boolean fourPanel = normalized(item.getName()).contains("tu than");
                    String name = normalized(item.getName());
                    String underlayer = fourPanel ? "Yếm và váy" : name.contains("ao ba ba") ? "Quần dài"
                            : name.contains("trang phuc nu thai (thanh hoa)") ? "Váy và thắt lưng" : "Quần lụa";
                    OutfitRecommendationResponse result = new OutfitRecommendationResponse(
                            "Phối đồ cùng " + item.getName(), item.getName(),
                            List.of(item.getName(), underlayer), recommendedAccessories(item, request, accessoryCatalog, male), palette,
                            item.getDescription(), item.getHistoricalPeriod(),
                            "Phối theo phong cách " + request.getStyle() + " cho " + request.getOccasion() + " · " + request.getRegion()
                                    + ". Mở Studio để thử màu và phụ kiện, kiểm tra bối cảnh trước khi lưu.");
                    result.setCulturalItemId(item.getId());
                    result.setImageUrl(item.getImageUrl());
                    return result;
                }).toList();
    }

    private boolean supportsGender(CulturalItem item, boolean male) {
        return GarmentRules.supportsGender(item.getName(), male);
    }

    private List<String> recommendedAccessories(CulturalItem garment, OutfitPreferenceRequest request,
                                               List<CulturalItem> catalog, boolean male) {
        String name = normalized(garment.getName());
        // This local Thai ensemble has no matching accessory record yet.
        if (name.contains("trang phuc nu thai (thanh hoa)")) return List.of();
        List<String> result = new ArrayList<>();
        if (name.contains("ao ba ba")) {
            addAccessory(result, catalog, "khan ran", male);
            addAccessory(result, catalog, "non la", male);
        } else {
            String context = normalized(request.getOccasion());
            boolean casual = context.contains("hang ngay") || context.contains("dao pho") || context.contains("chup anh");
            if ((name.contains("ao dai") || name.contains("tu than")) && casual) {
                addAccessory(result, catalog, "non la", male);
            } else if (name.contains("ao dai") || name.contains("tu than") || name.contains("nhat binh")
                    || name.contains("ao tac") || name.contains("ngu than")) {
                addAccessory(result, catalog, male ? "khan dong" : "man", male);
            }
            addAccessory(result, catalog, "quat", male);
        }
        return result;
    }

    private void addAccessory(List<String> result, List<CulturalItem> catalog, String keyword, boolean male) {
        catalog.stream().filter(item -> keyword.equals("man") ? normalized(item.getName()).matches(".*\\bman\\b.*")
                        : normalized(item.getName()).contains(keyword))
                .sorted(Comparator.comparing(CulturalItem::getId)).findFirst().ifPresent(item -> {
                    String name = normalized(item.getName());
                    result.add(name.matches(".*\\bman\\b.*") && name.contains("khan dong")
                            ? (male ? "Khăn đóng truyền thống" : "Mấn truyền thống") : item.getName());
                });
    }

    private int recommendationScore(CulturalItem item, OutfitPreferenceRequest request) {
        String name = normalized(item.getName());
        String context = normalized(request.getOccasion()) + " " + normalized(request.getStyle());
        String region = normalized(request.getRegion()).split(" \\(")[0];
        int score = !region.isBlank() && normalized(item.getRegion()).contains(region) ? 2 : 0;
        if (name.contains("nhat binh") && (context.contains("cuoi") || context.contains("hoang gia"))) score += 6;
        if (name.contains("tac") && (context.contains("nghi le") || context.contains("tet") || context.contains("si phu"))) score += 6;
        if (name.contains("tu than") && context.contains("dan gian")) score += 7;
        if (name.contains("giao linh") && (context.contains("chup anh") || context.contains("co dien"))) score += 4;
        if (name.contains("ao dai") && (context.contains("tan thoi") || context.contains("dao pho"))) score += 6;
        if (name.contains("ao ba ba") && (context.contains("dan gian") || context.contains("hang ngay"))) score += 7;
        if (name.contains("ngu than") && name.contains("tay chen")
                && (context.contains("si phu") || context.contains("hang ngay") || context.contains("dao pho"))) score += 6;
        if (name.contains("trang phuc nu thai (thanh hoa)") && context.contains("dan gian")) score += 7;
        return score;
    }

    private String colorHex(String value) {
        String color = normalized(value.trim());
        if (color.matches("#[a-f0-9]{6}")) return color.toUpperCase(Locale.ROOT);
        if (color.contains("do")) return "#C0392B";
        if (color.contains("vang")) return "#D4AF37";
        if (color.contains("co vit")) return "#1E4D2B";
        if (color.contains("trang")) return "#FFFFFF";
        if (color.contains("lam")) return "#1A365D";
        return "";
    }

    @Transactional
    public OutfitResponse saveOutfit(Long userId, CreateOutfitRequest request) {
        Outfit outfit = new Outfit();
        outfit.setUserId(userId);
        outfit.setName(request.getName());
        outfit.setOccasion(request.getOccasion());
        outfit.setRegion(request.getRegion());
        outfit.setStyle(request.getStyle());
        outfit.setPrimaryGarment(request.getPrimaryGarment());
        outfit.setGender(request.getGender());
        outfit.setCulturalNotes(request.getCulturalNotes());
        outfit.setStatus("SAVED");
        if (request.getVisibility() != null) {
            outfit.setVisibility(request.getVisibility());
        }

        try {
            if (request.getColors() != null) {
                outfit.setColorsJson(objectMapper.writeValueAsString(request.getColors()));
            }
            if (request.getAccessories() != null) {
                outfit.setAccessoriesJson(objectMapper.writeValueAsString(request.getAccessories()));
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to parse colors/accessories to JSON", e);
            throw new BusinessRuleException("JSON_PARSE_ERROR", "Lỗi xử lý dữ liệu phối màu/phụ kiện");
        }

        Outfit saved = outfitRepository.save(outfit);
        return mapToResponse(saved);
    }

    public List<OutfitResponse> getUserOutfits(Long userId) {
        return outfitRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OutfitResponse getOutfitById(Long id, Long userId) {
        Outfit outfit = outfitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trang phục đã lưu"));
        return mapToResponse(outfit);
    }

    @Transactional
    public OutfitResponse updateOutfit(Long id, Long userId, CreateOutfitRequest request) {
        Outfit outfit = outfitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trang phục cần cập nhật"));

        outfit.setName(request.getName());
        outfit.setOccasion(request.getOccasion());
        outfit.setRegion(request.getRegion());
        outfit.setStyle(request.getStyle());
        outfit.setPrimaryGarment(request.getPrimaryGarment());
        if (request.getGender() != null) outfit.setGender(request.getGender());
        if (request.getCulturalNotes() != null) outfit.setCulturalNotes(request.getCulturalNotes());
        if (request.getVisibility() != null) outfit.setVisibility(request.getVisibility());

        try {
            if (request.getColors() != null) {
                outfit.setColorsJson(objectMapper.writeValueAsString(request.getColors()));
            }
            if (request.getAccessories() != null) {
                outfit.setAccessoriesJson(objectMapper.writeValueAsString(request.getAccessories()));
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to parse colors/accessories to JSON", e);
            throw new BusinessRuleException("JSON_PARSE_ERROR", "Lỗi xử lý dữ liệu phối màu/phụ kiện");
        }

        Outfit updated = outfitRepository.save(outfit);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteOutfit(Long id, Long userId) {
        Outfit outfit = outfitRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trang phục cần xóa"));
        outfitRepository.delete(outfit);
    }

    private OutfitResponse mapToResponse(Outfit outfit) {
        OutfitResponse res = new OutfitResponse();
        res.setId(outfit.getId());
        res.setUserId(outfit.getUserId());
        res.setName(outfit.getName());
        res.setOccasion(outfit.getOccasion());
        res.setRegion(outfit.getRegion());
        res.setStyle(outfit.getStyle());
        res.setPrimaryGarment(outfit.getPrimaryGarment());
        res.setGender(outfit.getGender());
        res.setCulturalNotes(outfit.getCulturalNotes());
        res.setStatus(outfit.getStatus());
        res.setVisibility(outfit.getVisibility());
        res.setCreatedAt(outfit.getCreatedAt());
        res.setUpdatedAt(outfit.getUpdatedAt());

        try {
            if (outfit.getColorsJson() != null) {
                res.setColors(objectMapper.readValue(outfit.getColorsJson(), new TypeReference<List<String>>() {}));
            } else {
                res.setColors(List.of());
            }
            if (outfit.getAccessoriesJson() != null) {
                res.setAccessories(objectMapper.readValue(outfit.getAccessoriesJson(), new TypeReference<List<String>>() {}));
            } else {
                res.setAccessories(List.of());
            }
        } catch (Exception e) {
            log.warn("Error deserializing colors/accessories JSON", e);
            res.setColors(List.of());
            res.setAccessories(List.of());
        }

        return res;
    }
}
