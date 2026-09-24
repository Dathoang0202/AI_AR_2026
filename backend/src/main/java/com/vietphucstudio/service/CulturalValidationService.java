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
        String genderStr = request.getGender() != null ? request.getGender().toLowerCase() : "female";
        List<String> accessories = request.getAccessories() != null ? request.getAccessories() : List.of();

        // FIX BUG: "female".contains("male") was returning true in Java!
        // Strictly check for male vs female:
        boolean isMale = (genderStr.equals("male") || genderStr.equals("nam")) && !genderStr.contains("female");

        String status = "COMPLIANT";

        // 1. GENDER VS GARMENT STRICT VIOLATION RULES
        if (garment.contains("nhật bình") && isMale) {
            status = "NON_COMPLIANT";
            issues.add("VI PHẠM QUY CHUẨN GIỚI TÍNH: Áo Nhật Bình là triều phục truyền thống dành riêng cho Phái Nữ (Hoàng Hậu, Công Chúa, Mệnh Phụ triều Nguyễn). Nam giới không mặc loại y phục này.");
            notes.add("Gợi ý khắc phục: Đối với Ma-nơ-canh Nam, vui lòng chọn Áo Tấc (Áo Ngũ Thân tay rộng) hoặc Áo Giao Lĩnh Nam.");
            sources.add(new CulturalSourceDto(
                    "Khâm Định Đại Nam Hội Điển Sự Lệ - Quyển 78 (Trang phục Mệnh phụ)",
                    "Quốc Sử Quán Triều Nguyễn",
                    "https://vi.wikipedia.org/wiki/Nhat_Binh"
            ));
        }

        // 2. GENDER VS ACCESSORY VIOLATION RULES
        for (String acc : accessories) {
            String accLower = acc.toLowerCase();
            if (accLower.contains("mấn") && isMale) {
                status = "NON_COMPLIANT";
                issues.add("VI PHẠM PHỤ KIỆN: 'Mấn thêu hoa' là phụ kiện đội đầu dành riêng cho Phái Nữ. Nam giới chuẩn mực nghi lễ chỉ đội Khăn đóng chỉ vàng hoặc Mũ mãng.");
                notes.add("Gợi ý: Đổi phụ kiện sang Khăn đóng chỉ vàng cho Ma-nơ-canh Nam.");
            }
        }

        // 3. COLOR VS OCCASION VIOLATION RULES
        if (garment.contains("nhật bình")) {
            if (!isMale) {
                notes.add("Áo Nhật Bình đại diện cho nét đẹp kiêu sa, quyền quý của nữ giới triều Nguyễn.");
                sources.add(new CulturalSourceDto(
                        "Ngàn Năm Áo Mũ",
                        "Trần Quang Đức - NXB Thế Giới",
                        "https://vi.wikipedia.org/wiki/Nhat_Binh"
                ));
            }

            if (color.contains("vàng") || color.contains("gold") || color.contains("hoàng")) {
                if (!occasion.contains("hoàng gia") && !occasion.contains("triển lãm")) {
                    if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
                    issues.add("LƯU Ý HOÀNG SẮC: Màu Hoàng Vàng (Chính sắc) trong quy chế triều Nguyễn vốn dành riêng cho Hoàng Gia / Hoàng Hậu. Khi mặc tham gia bối cảnh thông thường nên chọn tông Đỏ nhạt hoặc Xanh cổ vịt.");
                }
            }

            if (occasion.contains("thể thao") || occasion.contains("hằng ngày")) {
                status = "NON_COMPLIANT";
                issues.add("VI PHẠM BỐI CẢNH: Áo Nhật Bình là trang trọng lễ phục nghi lễ, không được dùng cho các hoạt động thể thao hoặc sinh hoạt hàng ngày năng động.");
            }
        } else if (garment.contains("giao lĩnh")) {
            notes.add("Áo Giao Lĩnh (cổ giao nhau) là cổ phục lâu đời phổ biến từ thời Lý - Trần - Lê.");
            sources.add(new CulturalSourceDto(
                    "Trang phục Việt Nam qua các thời kỳ",
                    "NXB Văn Hóa Thông Tin",
                    "https://vi.wikipedia.org/wiki/Trang_phuc_Viet_Nam"
            ));
        } else if (garment.contains("ngũ thân") || garment.contains("tấc")) {
            notes.add("Áo Ngũ Thân tay thụt / tay rộng (Áo Tấc) tượng trưng cho đạo lý ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín) theo nho giáo.");
            sources.add(new CulturalSourceDto(
                    "Lịch sử Trang phục Việt Nam",
                    "Trần Quang Đức",
                    "https://vi.wikipedia.org/wiki/Ao_dinh"
            ));
        } else if (garment.contains("dài")) {
            notes.add("Áo Dài là quốc phục mang tính biểu tượng cao của Việt Nam qua nhiều thời kỳ.");
        }

        // Color funeral / Taboo checks
        if (color.contains("trắng") && occasion.contains("cưới")) {
            if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
            issues.add("CẢNH BÁO MÀU SẮC CƯỚI HỎI: Trong hỷ sự cưới hỏi truyền thống Việt Nam, nên ưu tiên màu Đỏ / Hoàng Vàng (Hỷ sắc). Tông màu Trắng thuần túy trong cưới hỏi cổ truyền bị hạn chế.");
        }

        // Accessories notes & validation
        for (String acc : accessories) {
            String accLower = acc.toLowerCase();
            if (accLower.contains("khăn đóng")) {
                notes.add("Khăn đóng tôn vinh chiều cao và sự chỉnh chu trang trọng.");
            } else if (accLower.contains("nón lá")) {
                notes.add("Nón lá kết hợp nét dịu dàng truyền thống.");
            }
        }

        if (issues.isEmpty() && status.equals("COMPLIANT")) {
            notes.add("Bộ trang phục hoàn toàn tuân thủ các quy chuẩn nghi lễ và di sản văn hóa Việt Nam.");
        }

        return new CulturalValidationResponse(status, issues, notes, sources);
    }
}
