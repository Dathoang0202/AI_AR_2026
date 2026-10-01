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
        } else if (garment.contains("trang phuc nu thai (thanh hoa)")) {
            if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
            issues.add("Mô phỏng dựa trên một mẫu trang phục nữ Thái ở Thanh Hóa năm 1977, giản lược hoa văn. Cần đối chiếu tư liệu địa phương khi chọn phụ kiện hoặc phục dựng nghi lễ.");
            notes.add("Mẫu này không đại diện cho mọi nhóm Thái. Các phụ kiện hiện có chưa được đối chiếu riêng với bộ trang phục này.");
            sources.add(new CulturalSourceDto("Trang phục Thái, Thanh Hóa, 1977 — ảnh hiện vật", "Daderot / Bảo tàng Phụ nữ Việt Nam",
                    "https://commons.wikimedia.org/wiki/File:Costume,_Thai,_Thanh_Hoa,_1977,_view_1,_cotton,_ikat,_patterns_woven_with_extra_threads_and_silk_embroidery_-_Vietnamese_Women%27s_Museum_-_Hanoi,_Vietnam_-_DSC03910.JPG"));
        } else if (garment.contains("ao ba ba")) {
            notes.add("Áo Bà Ba và quần dài gắn với sinh hoạt Nam Bộ; có thể thử cùng khăn rằn và nón lá trong gợi ý dân gian.");
            if (occasion.contains("hoang gia") || occasion.contains("cung dinh")) {
                if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
                issues.add("Chưa có tư liệu đối chiếu áo Bà Ba với bối cảnh cung đình đã chọn.");
            }
        } else if (garment.contains("ngu than") && garment.contains("tay chen")) {
            notes.add("Ngũ thân tay chẽn có ống tay hẹp, khác áo Tấc tay thụng. Chọn biến thể nam hoặc nữ và phụ kiện theo bối cảnh phục dựng.");
            sources.add(new CulturalSourceDto("Đưa áo dài ngũ thân sống lại bản sắc vốn có", "Báo Tin tức — TTXVN",
                    "https://baotintuc.vn/van-hoa/ton-vinh-gia-tri-van-hoa-truyen-thong-bai-cuoi-dua-ao-dai-ngu-than-song-lai-ban-sac-von-co-20210213074311146.htm"));
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
                    && !name.contains("non la") && !name.contains("vong co") && !name.contains("quat") && !name.contains("khan ran")) {
                if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
                issues.add("Phụ kiện " + accessory + " chưa có đủ quy tắc đối chiếu văn hóa.");
            }
            if (name.contains("khan ran") && (garment.contains("nhat binh") || garment.contains("ao tac"))) {
                if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
                issues.add("Khăn rằn với y phục lễ phục này là gợi ý phối sáng tạo; chưa có tư liệu để xác nhận cách phối phục dựng lịch sử.");
            }
        }
        long headwearCount = accessories.stream().map(GarmentRules::normalized)
                .filter(name -> name.contains("non la") || name.contains("khan dong") || name.matches(".*\\bman\\b.*")).count();
        if (headwearCount > 1) {
            if (!status.equals("NON_COMPLIANT")) status = "CAUTION";
            issues.add("Đang chọn nhiều phụ kiện đội đầu. Chọn một món để hình mô phỏng khớp với bộ phối lưu lại.");
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
