package com.vietphucstudio.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vietphucstudio.dto.*;
import com.vietphucstudio.entity.Outfit;
import com.vietphucstudio.exception.BusinessRuleException;
import com.vietphucstudio.exception.ResourceNotFoundException;
import com.vietphucstudio.repository.OutfitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OutfitService {

    private static final Logger log = LoggerFactory.getLogger(OutfitService.class);

    private final OutfitRepository outfitRepository;
    private final ObjectMapper objectMapper;

    public OutfitService(OutfitRepository outfitRepository, ObjectMapper objectMapper) {
        this.outfitRepository = outfitRepository;
        this.objectMapper = objectMapper;
    }

    public List<OutfitRecommendationResponse> generateRecommendations(OutfitPreferenceRequest request) {
        List<OutfitRecommendationResponse> list = new ArrayList<>();
        String occasion = request.getOccasion() != null ? request.getOccasion() : "Tết / Lễ hội";
        String region = request.getRegion() != null ? request.getRegion() : "Miền Bắc";
        String style = request.getStyle() != null ? request.getStyle() : "Cổ điển";

        if (occasion.toLowerCase().contains("cưới") || style.toLowerCase().contains("hoàng gia")) {
            list.add(new OutfitRecommendationResponse(
                    "Bộ Nhật Bình Hoàng Gia Huế",
                    "Áo Nhật Bình",
                    List.of("Áo Nhật Bình gấm thêu phượng", "Áo lót trong màu trắng", "Quần lụa trắng"),
                    List.of("Mấn quấn chỉ vàng", "Hài thêu hoa", "Quạt xếp trầm hương"),
                    List.of("#D4AF37", "#C0392B", "#FFFFFF"),
                    "Áo Nhật Bình là trang phục hoàng gia triều Nguyễn, đại diện cho nét đẹp kiêu sa và quý phái.",
                    "Triều Nguyễn (1802 - 1945)",
                    "Phù hợp mặc trong lễ cưới truyền thống, chụp ảnh nghệ thuật hoặc dịp trọng đại."
            ));
        }

        if (region.toLowerCase().contains("bắc") || style.toLowerCase().contains("cổ điển")) {
            list.add(new OutfitRecommendationResponse(
                    "Bộ Ngũ Thân Lễ Phục (Áo Tấc)",
                    "Áo Tấc / Áo Ngũ Thân",
                    List.of("Áo Tấc tay thụt lụa tơ tằm", "Quần lụa dệt chéo", "Áo lót cổ đứng"),
                    List.of("Khăn đóng đen / mấn đen", "Guốc gỗ truyền thống", "Túi gấm gài thắt lưng"),
                    List.of("#1A365D", "#D4AF37", "#2D3748"),
                    "Áo Tấc là lễ phục đứng đắn của người Việt xưa, tượng trưng cho phong thái chỉn chu và tôn kính.",
                    "Thế kỷ XVIII - XX",
                    "Kết hợp tuyệt vời cho các buổi nghi lễ, đi chùa, dâng hương hoặc chúc Tết."
            ));
        }

        // Always include iconic Áo Dài recommendation
        list.add(new OutfitRecommendationResponse(
                "Áo Dài Ngũ Thân Tân Thời",
                "Áo Dài",
                List.of("Áo Dài 5 thân lụa Hà Đông", "Quần lụa satin rủ"),
                List.of("Vòng cổ ngọc trai", "Khăn lụa choàng vai", "Ví cầm tay thêu tay"),
                List.of("#C0392B", "#F6E05E", "#FFFFFF"),
                "Áo Dài đại diện cho sự giao thoa hoàn hảo giữa nét đài các truyền thống và sự duyên dáng hiện đại.",
                "Đầu thế kỷ XX - Hiện đại",
                "Thích hợp cho mọi dịp tết, dạo phố, sự kiện văn hóa và gặp gỡ trang trọng."
        ));

        return list;
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
