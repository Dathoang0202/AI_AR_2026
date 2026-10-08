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
import java.util.stream.IntStream;
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
                throw new BusinessRuleException("INCOMPATIBLE_GARMENT", "Biến thể y phục này không khớp với dáng người đã chọn trong danh mục phục dựng. Hãy đổi ma-nơ-canh hoặc chọn y phục khác.");
            }
            garments = List.of(selected);
        }
        List<CulturalItem> accessoryCatalog = culturalItemRepository.findByCategory("ACCESSORY");
        List<String> colors = request.getPreferredColors() == null ? List.of() : request.getPreferredColors().stream()
                .filter(value -> value != null && !value.isBlank()).map(this::colorHex)
                .filter(value -> !value.isEmpty()).distinct().limit(8).toList();
        List<String> preferredPalette = colors.isEmpty() ? List.of("#C0392B", "#1E4D2B", "#FDFBF7") : colors;
        List<CulturalItem> ranked = garments.stream().filter(item -> supportsGender(item, male))
                .filter(item -> request.getCulturalItemId() != null || !GarmentRules.needsSpecificReference(item.getName()))
                .filter(item -> GarmentRules.supportsOccasion(item.getName(), request.getOccasion()))
                .sorted(Comparator.<CulturalItem>comparingInt(item -> recommendationScore(item, request)).reversed()
                        .thenComparing(CulturalItem::getId)).limit(3)
                .toList();
        return IntStream.range(0, ranked.size()).mapToObj(index -> {
                    CulturalItem item = ranked.get(index);
                    boolean fourPanel = normalized(item.getName()).contains("tu than");
                    String name = normalized(item.getName());
                    String underlayer = name.contains("ao yem") ? "Váy" : name.contains("con mien") ? "Thường, tế tất và mũ miện"
                            : name.contains("doi kham") ? "Áo trong và quần lụa"
                            : name.contains("tran thu") || name.contains("vat ho") || name.contains("ngu lam") ? "Quần vải"
                            : fourPanel ? "Yếm và váy" : name.contains("trang phuc nu thai (thanh hoa)")
                            ? "Váy và thắt lưng" : name.contains("ao dai") || name.contains("ao ba ba")
                            || name.contains("tay chen") ? "Quần dài" : "Quần lụa";
                    List<String> palette = recommendationPalette(preferredPalette, index,
                            request.getCulturalItemId() != null, request.getOccasion());
                    List<String> accessories = recommendedAccessories(item, request, accessoryCatalog, male);
                    OutfitRecommendationResponse result = new OutfitRecommendationResponse(
                            "Phối đồ cùng " + item.getName(), item.getName(),
                            List.of(item.getName(), underlayer), accessories, palette,
                            item.getDescription(), item.getHistoricalPeriod(),
                            stylingAdvice(underlayer, accessories, palette));
                    result.setCulturalItemId(item.getId());
                    result.setImageUrl(item.getImageUrl());
                    result.setMatchReasons(recommendationReasons(item, request));
                    return result;
                }).toList();
    }

    private List<String> recommendationPalette(List<String> preferred, int index, boolean selectedGarment, String occasion) {
        if (selectedGarment) return preferred;
        String primary = preferred.get(index % preferred.size());
        String context = normalized(occasion);
        boolean formal = context.contains("cuoi") || context.contains("tet") || context.contains("nghi le");
        String accent;
        if (index == 0 && preferred.size() > 1) accent = preferred.get(1);
        else if (preferred.size() == 1) accent = List.of("#FDFBF7", "#1A365D", "#D4AF37").get(index);
        else accent = formal || index == 1 ? "#FDFBF7" : "#895B3F";
        if (accent.equals(primary)) accent = "#FDFBF7".equals(primary) ? "#1A365D" : "#FDFBF7";
        return List.of(primary, accent);
    }

    private String stylingAdvice(String underlayer, List<String> accessories, List<String> palette) {
        StringBuilder advice = new StringBuilder("Dùng ").append(colorLabel(palette.get(0)))
                .append(" làm màu chính");
        if (palette.size() > 1) advice.append(", ").append(colorLabel(palette.get(1))).append(" làm màu điểm");
        advice.append("; phối cùng ").append(underlayer.toLowerCase(Locale.ROOT)).append(".");
        if (accessories.isEmpty()) advice.append(" Giữ phụ kiện tối giản để tập trung vào phom áo.");
        else advice.append(" Thử thêm ").append(String.join(" và ", accessories)).append(".");
        return advice.toString();
    }

    private String colorLabel(String hex) {
        return switch (hex) {
            case "#C0392B" -> "đỏ son";
            case "#D4AF37" -> "vàng";
            case "#FDFBF7" -> "trắng ngà";
            case "#1A365D" -> "xanh lam";
            case "#292524" -> "đen mực";
            case "#895B3F" -> "nâu đất";
            case "#1E4D2B" -> "xanh cổ vịt";
            default -> hex;
        };
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
        if (name.contains("tran thu") || GarmentRules.needsSpecificReference(name)) return List.of();
        if (GarmentRules.isCourtGarment(name)) {
            if (name.contains("bo tu") || name.contains("vien linh")) addAccessory(result, catalog, "canh chuon", male);
            if (!name.contains("con mien")) addAccessory(result, catalog, "dai ngoc", male);
            addAccessory(result, catalog, "hai cung dinh", male);
        } else if (name.contains("ao yem") || (name.contains("tu than") && catalog.stream().anyMatch(item -> normalized(item.getName()).contains("quai thao")))) {
            addAccessory(result, catalog, name.contains("ao yem") ? "mo qua" : "quai thao", male);
            addAccessory(result, catalog, "guoc moc", male);
        } else if (name.contains("doi kham")) {
            addAccessory(result, catalog, "tram cai", male);
            addAccessory(result, catalog, "guoc moc", male);
        } else if (name.contains("ao ba ba") || name.contains("vat ho")) {
            addAccessory(result, catalog, "khan ran", male);
            addAccessory(result, catalog, "non la", male);
        } else {
            String context = normalized(request.getOccasion());
            boolean daily = context.contains("hang ngay");
            boolean street = context.contains("dao pho");
            boolean casual = context.contains("hang ngay") || context.contains("dao pho") || context.contains("chup anh");
            if ((name.contains("ao dai") || name.contains("tu than")) && casual) {
                addAccessory(result, catalog, "non la", male);
            } else if (!daily && !street && !(name.contains("tay chen") && context.contains("tet"))
                    && (name.contains("ao dai") || name.contains("tu than") || name.contains("nhat binh")
                    || name.contains("ao tac") || name.contains("ngu than"))) {
                addAccessory(result, catalog, male ? "khan dong" : "man", male);
            }
            if (context.contains("chup anh")) addAccessory(result, catalog, "quat", male);
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
        String occasion = normalized(request.getOccasion());
        String style = normalized(request.getStyle());
        int score = regionScore(item, request.getRegion());
        if (style.contains("hoang gia")) {
            if (name.contains("nhat binh")) score += 9;
            else if (name.contains("hoang bao") || name.contains("phuong bao")) score += 10;
            else if (name.contains("mang bao") || name.contains("con mien")) score += 7;
            else if (GarmentRules.isCourtGarment(name)) score += 4;
            else if (name.contains("ao tac")) score += 3;
        } else if (style.contains("si phu")) {
            if (name.contains("ao tac") || name.contains("tay chen")) score += 8;
            else if (name.contains("vien linh") || name.contains("doi kham")) score += 7;
            else if (name.contains("giao linh")) score += 3;
        } else if (style.contains("tan thoi")) {
            if (name.contains("ao dai")) score += 9;
            else if (name.contains("tay chen")) score += 3;
        } else if (style.contains("dan gian")) {
            if (name.contains("tu than") || name.contains("ao ba ba") || name.contains("trang phuc nu thai")) score += 8;
            else if (name.contains("vat ho") || name.contains("ao yem")) score += 7;
            else if (name.contains("giao linh")) score += 2;
        }
        if (occasion.contains("cuoi")) {
            if (name.contains("nhat binh")) score += 7;
            else if (name.contains("ao dai") || name.contains("ao tac")) score += 4;
        } else if (occasion.contains("tet")) {
            if (name.contains("ao dai") || name.contains("ao tac")) score += 5;
            else if (name.contains("tay chen")) score += 3;
        } else if (occasion.contains("chup anh")) {
            if (name.contains("giao linh")) score += 4;
            else if (name.contains("tu than") || name.contains("trang phuc nu thai") || name.contains("nhat binh")) score += 3;
        } else if (occasion.contains("nghi le") || occasion.contains("dang huong")) {
            if (name.contains("ao tac")) score += 6;
            else if (name.contains("nhat binh") || name.contains("giao linh")) score += 3;
        } else if (occasion.contains("dao pho")) {
            if (name.contains("ao dai")) score += 6;
            else if (name.contains("tay chen")) score += 5;
            else if (name.contains("ao ba ba")) score += 3;
        } else if (occasion.contains("hang ngay")) {
            if (name.contains("ao ba ba")) score += 7;
            else if (name.contains("tay chen")) score += 6;
            else if (name.contains("ao dai")) score += 3;
            else if (name.contains("ao tac")) score -= 5;
        }
        if (GarmentRules.isCourtGarment(name) && !style.contains("hoang gia")) score -= 6;
        if ((name.contains("tran thu") || name.contains("ngu lam")) && !occasion.contains("chup anh")) score -= 8;
        return score;
    }

    private int regionScore(CulturalItem item, String selectedRegion) {
        String selected = normalized(selectedRegion);
        String region = normalized(item.getRegion());
        if (selected.isBlank() || region.isBlank()) return 0;
        if (region.contains("toan quoc")) return 1;
        if (selected.contains("hue") && region.contains("thanh hoa")) return -6;
        String broadRegion = selected.split(" \\(")[0];
        return region.contains(broadRegion) ? 3 : -2;
    }

    private List<String> recommendationReasons(CulturalItem item, OutfitPreferenceRequest request) {
        String name = normalized(item.getName());
        String style = normalized(request.getStyle());
        String occasion = normalized(request.getOccasion());
        List<String> reasons = new ArrayList<>();
        if (GarmentRules.isWorkbookGarment(name)) {
            if (GarmentRules.isCourtGarment(name)) reasons.add("Thử phom áo cung đình theo cảm hứng đã chọn; cần đối chiếu phẩm cấp, niên đại và nghi thức trước khi phục dựng.");
            else if (name.contains("ao yem")) reasons.add("Yếm được mô phỏng cùng váy; cần cân nhắc lớp áo ngoài theo dịp sử dụng.");
            else if (name.contains("doi kham")) reasons.add("Hai vạt mở và lớp áo trong tạo một phương án phối nhiều lớp.");
            else if (name.contains("vat ho")) reasons.add("Áo thân ngắn tạo hướng phối dân gian gọn gàng.");
            else reasons.add("Mô phỏng từ danh mục bổ sung; đối chiếu tư liệu riêng khi phục dựng lịch sử.");
        }
        if (style.contains("hoang gia") && name.contains("nhat binh"))
            reasons.add("Lễ phục cung đình hợp cảm hứng hoàng gia bạn chọn.");
        else if (style.contains("si phu") && (name.contains("ao tac") || name.contains("tay chen")))
            reasons.add("Dáng ngũ thân hợp hướng phối nho nhã, chỉn chu.");
        else if (style.contains("tan thoi") && name.contains("ao dai"))
            reasons.add("Dáng áo dài hợp phong cách tân thời, thanh lịch.");
        else if (style.contains("tan thoi") && name.contains("tay chen"))
            reasons.add("Tay áo gọn tạo một phương án truyền thống tiết chế hơn áo dài tân thời.");
        else if (style.contains("dan gian") && (name.contains("tu than") || name.contains("ao ba ba") || name.contains("trang phuc nu thai")))
            reasons.add("Bộ trang phục gợi cảm hứng dân gian, gần gũi.");

        if (occasion.contains("cuoi") && (name.contains("nhat binh") || name.contains("ao dai") || name.contains("ao tac")))
            reasons.add("Có thể thử cho dịp cưới; khi phục dựng cần xét vai trò và nghi thức cụ thể.");
        else if (occasion.contains("tet") && (name.contains("ao dai") || name.contains("ao tac")))
            reasons.add("Dáng áo chỉn chu để thử trong dịp Tết.");
        else if (occasion.contains("tet") && name.contains("tay chen"))
            reasons.add("Có thể thử dáng áo gọn cho dịp Tết với phụ kiện tối giản.");
        else if (occasion.contains("chup anh"))
            reasons.add("Phom áo tạo một lựa chọn khác cho ảnh di sản.");
        else if (occasion.contains("hang ngay") && (name.contains("ao ba ba") || name.contains("tay chen")))
            reasons.add("Dáng áo gọn, phù hợp hướng phối sinh hoạt hằng ngày.");
        else if (occasion.contains("dao pho") && (name.contains("ao dai") || name.contains("tay chen")))
            reasons.add("Phom áo có thể thử cho dạo phố hoặc sự kiện văn hóa.");

        if (regionScore(item, request.getRegion()) >= 3)
            reasons.add("Mục trưng bày gắn trang phục với " + item.getRegion() + ".");
        if (reasons.isEmpty()) reasons.add("Một dáng áo khác trong bộ sưu tập để bạn so sánh khi mặc thử.");
        return reasons.stream().limit(3).toList();
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
