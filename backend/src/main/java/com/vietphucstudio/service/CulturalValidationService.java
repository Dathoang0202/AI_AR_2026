package com.vietphucstudio.service;

import com.vietphucstudio.dto.CulturalValidationRequest;
import com.vietphucstudio.dto.CulturalValidationResponse;
import com.vietphucstudio.dto.CulturalValidationResponse.CulturalSourceDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CulturalValidationService {

    public CulturalValidationResponse validateOutfit(CulturalValidationRequest request) {
        List<String> issues = new ArrayList<>();
        List<String> notes = new ArrayList<>();
        List<CulturalSourceDto> sources = new ArrayList<>();

        String garment = request.getGarment() != null ? request.getGarment().toLowerCase() : "";
        String color = request.getColor() != null ? request.getColor().toLowerCase() : "";
        String occasion = request.getOccasion() != null ? request.getOccasion().toLowerCase() : "";
        List<String> accessories = request.getAccessories() != null ? request.getAccessories() : List.of();

        String status = "COMPLIANT";

        // Garment & Color & Occasion Rules
        if (garment.contains("nhật bình")) {
            notes.add("Áo Nhật Bình là lễ phục cao quý của phái nữ triều Nguyễn (hoàng hậu, công chúa, mệnh phụ).");
            sources.add(new CulturalSourceDto(
                    "Khâm Định Đại Nam Hội Điển Sự Lệ",
                    "Quốc Sử Quán Triều Nguyễn",
                    "https://vi.wikipedia.org/wiki/Nhat_Binh"
            ));

            if (color.contains("vàng") || color.contains("gold") || color.contains("hoàng")) {
                if (!occasion.contains("hoàng gia") && !occasion.contains("triển lãm")) {
                    status = "CAUTION";
                    issues.add("Màu vàng chính sắc (Hoàng sắc) trong triều Nguyễn vốn dành riêng cho Hoàng hậu. Khi diện dịp thông thường nên chọn tông vàng nhạt hoặc đỏ, xanh.");
                }
            }

            if (occasion.contains("thể thao") || occasion.contains("hằng ngày")) {
                status = "NON_COMPLIANT";
                issues.add("Áo Nhật Bình là trang trọng lễ phục, không phù hợp mặc cho các hoạt động thể thao hoặc sinh hoạt hàng ngày năng động.");
            }
        } else if (garment.contains("giao lĩnh")) {
            notes.add("Áo Giao Lĩnh (cổ giao nhau) là trang phục cổ xưa phổ biến từ thời Lý - Trần - Lê.");
            sources.add(new CulturalSourceDto(
                    "Trang phục Việt Nam qua các thời kỳ",
                    "NXB Văn Hóa Thông Tin",
                    "https://vi.wikipedia.org/wiki/Trang_phuc_Viet_Nam"
            ));
        } else if (garment.contains("ngũ thân") || garment.contains("tấc")) {
            notes.add("Áo Ngũ Thân tay thụt / tay rộng (Áo Tấc) đại diện cho phong thái khiêm nhường, kính cẩn theo nho giáo thời Nguyễn.");
            sources.add(new CulturalSourceDto(
                    "Ngàn Năm Áo Mũ",
                    "Trần Quang Đức - NXB Thế Giới",
                    "https://vi.wikipedia.org/wiki/Ao_dinh"
            ));
        } else if (garment.contains("dài")) {
            notes.add("Áo Dài là quốc phục mang tính biểu tượng cao của Việt Nam qua nhiều thời kỳ phát triển.");
        }

        // Accessory checks
        for (String acc : accessories) {
            String accLower = acc.toLowerCase();
            if (accLower.contains("khăn đóng") || accLower.contains("mấn")) {
                notes.add("Khăn đóng/mấn giúp tôn vinh chiều cao và sự trang trọng cho tổng thể trang phục.");
            } else if (accLower.contains("nón lá")) {
                notes.add("Nón lá kết hợp nét dịu dàng truyền thống đậm chất Nam Bộ và Bắc Bộ.");
            }
        }

        if (issues.isEmpty() && status.equals("COMPLIANT")) {
            notes.add("Bộ trang phục kết hợp hài hòa với bối cảnh văn hóa và nghi lễ được chọn.");
        }

        return new CulturalValidationResponse(status, issues, notes, sources);
    }
}
