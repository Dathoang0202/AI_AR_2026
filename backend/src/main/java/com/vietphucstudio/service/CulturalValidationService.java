package com.vietphucstudio.service;

import com.vietphucstudio.dto.CulturalValidationRequest;
import com.vietphucstudio.dto.CulturalValidationResponse;
import com.vietphucstudio.dto.CulturalValidationResponse.CulturalSourceDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.vietphucstudio.service.GarmentRules.normalized;

@Service
public class CulturalValidationService {
    public CulturalValidationResponse validateOutfit(CulturalValidationRequest request) {
        List<String> issues = new ArrayList<>();
        List<String> notes = new ArrayList<>();
        List<CulturalSourceDto> sources = new ArrayList<>();
        String garment = normalized(request.getGarment());
        String color = normalized(request.getColor());
        String occasion = normalized(request.getOccasion());
        String gender = normalized(request.getGender());
        boolean male = gender.equals("male") || gender.equals("nam");
        List<String> accessories = request.getAccessories() == null ? List.of() : request.getAccessories();
        String status = "COMPLIANT";

        if (!GarmentRules.supportsGender(garment, male)) {
            status = "NON_COMPLIANT";
            issues.add(request.getGarment() + " không khớp với ma-nơ-canh " + (male ? "nam" : "nữ")
                    + " trong cách phục dựng trang phục truyền thống đang áp dụng.");
            notes.add("Có thể đổi y phục phù hợp hoặc đổi ma-nơ-canh. Kích thước mô phỏng vừa người không có nghĩa là phù hợp bối cảnh văn hóa.");
        }
        if (garment.contains("nhat binh")) {
            notes.add("Nhật Bình gắn với trang phục phụ nữ hoàng tộc và mệnh phụ triều Nguyễn.");
            sources.add(new CulturalSourceDto("Ba cô gái Bắc - Trung - Nam", "Bảo tàng Minh Long",
                    "https://museum.minhlong.com/en/exhibitions/tuong-3-co-gai"));
            if (!GarmentRules.supportsOccasion(garment, occasion)) {
                status = "NON_COMPLIANT";
                issues.add("Nhật Bình không phù hợp với bối cảnh thể thao hoặc sinh hoạt hằng ngày trong gợi ý phục dựng này. Hãy chọn dịp lễ hoặc chụp ảnh di sản.");
            }
            if ((color.contains("vang") || color.contains("gold") || color.contains("#d4af37"))
                    && !occasion.contains("hoang gia") && !occasion.contains("trien lam")) {
                if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
                issues.add("Cần đối chiếu sắc vàng và hoa văn với phẩm cấp, thời kỳ cụ thể nếu phục dựng Nhật Bình cung đình.");
            }
        } else if (garment.contains("tu than")) {
            notes.add("Áo Tứ Thân và váy thuộc trang phục truyền thống của phụ nữ miền Bắc, thường phối cùng yếm.");
            sources.add(new CulturalSourceDto("Women's Fashion — Viet's mode", "Bảo tàng Phụ nữ Việt Nam",
                    "https://baotangphunu.org.vn/en/womens-fashion-2/"));
        } else if (GarmentRules.isKnown(garment)) {
            notes.add("Cần chọn đúng biến thể, niên đại và phụ kiện của y phục khi phục dựng một nghi lễ cụ thể.");
        } else {
            if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
            issues.add("Y phục này chưa có đủ quy tắc đối chiếu. Chưa thể kết luận phù hợp văn hóa.");
        }

        for (String accessory : accessories) {
            String name = normalized(accessory);
            if (male && name.matches(".*\\bman\\b.*")) {
                status = "NON_COMPLIANT";
                issues.add("Mấn trong bộ sưu tập này được phối cho ma-nơ-canh nữ. Có thể chọn khăn đóng khi phối cho ma-nơ-canh nam.");
            } else if (!name.contains("khan dong") && !name.matches(".*\\bman\\b.*")
                    && !name.contains("non la") && !name.contains("vong co") && !name.contains("quat")) {
                if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
                issues.add("Phụ kiện " + accessory + " chưa có đủ quy tắc đối chiếu văn hóa.");
            }
        }
        if ((color.contains("trang") || color.contains("#ffffff") || color.contains("#fdfbf7")) && occasion.contains("cuoi")) {
            if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
            issues.add("Với tông trắng trong cưới hỏi phục dựng, hãy đối chiếu phong tục vùng miền và thời kỳ; các bối cảnh cưới hiện đại có thể khác.");
        }
        if (occasion.isBlank()) {
            if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
            issues.add("Chọn dịp sử dụng để kiểm tra bối cảnh phối đồ.");
        }
        if (status.equals("COMPLIANT")) notes.add("Chưa phát hiện xung đột trong các quy tắc hiện có. Đây là gợi ý tham khảo, không phải chứng nhận phục dựng lịch sử.");
        return new CulturalValidationResponse(status, issues, notes, sources);
    }
}
