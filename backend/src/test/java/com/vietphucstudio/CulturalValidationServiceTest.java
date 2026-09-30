package com.vietphucstudio;

import com.vietphucstudio.dto.CulturalValidationRequest;
import com.vietphucstudio.service.CulturalValidationService;
import org.junit.jupiter.api.Test;
import java.text.Normalizer;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class CulturalValidationServiceTest {
    private final CulturalValidationService service = new CulturalValidationService();

    private CulturalValidationRequest request(String garment, String gender) {
        CulturalValidationRequest request = new CulturalValidationRequest();
        request.setGarment(garment); request.setGender(gender);
        request.setColor("#C0392B"); request.setOccasion("Chụp ảnh di sản / nghệ thuật");
        return request;
    }

    @Test
    void switchingFemaleGarmentsToMaleInvalidatesThePreviousResult() {
        for (String garment : List.of("Áo Nhật Bình", "Áo Tứ Thân", "Áo dài nữ")) {
            CulturalValidationRequest request = request(garment, "female");
            assertEquals("COMPLIANT", service.validateOutfit(request).getStatus(), garment);
            request.setGender("male");
            var result = service.validateOutfit(request);
            assertEquals("NON_COMPLIANT", result.getStatus(), garment);
            assertFalse(result.getIssues().isEmpty());
            request.setGender("female");
            assertEquals("COMPLIANT", service.validateOutfit(request).getStatus(), garment);
        }
    }

    @Test
    void sharedGarmentFamiliesWorkOnBothBodiesAndMaleVariantsAreChecked() {
        for (String garment : List.of("Áo Giao Lĩnh", "Áo Tấc (Áo Ngũ Thân Lễ Phục)", "Áo Dài")) {
            for (String gender : List.of("female", "male")) assertEquals("COMPLIANT", service.validateOutfit(request(garment, gender)).getStatus());
        }
        assertEquals("NON_COMPLIANT", service.validateOutfit(request("Áo giao lĩnh nam", "female")).getStatus());
    }

    @Test
    void rulesRecognizeDecomposedUnicodeAndUnaccentedGarmentNames() {
        assertEquals("NON_COMPLIANT", service.validateOutfit(request(Normalizer.normalize("Áo Tứ Thân", Normalizer.Form.NFD), "male")).getStatus());
        assertEquals("NON_COMPLIANT", service.validateOutfit(request("AO NHAT BINH", "male")).getStatus());
    }

    @Test
    void keepingFemaleAccessoriesOnMaleBodyRequiresAdjustment() {
        var request = request("Áo Tấc", "male");
        request.setAccessories(List.of("Mấn truyền thống"));
        assertEquals("NON_COMPLIANT", service.validateOutfit(request).getStatus());
        request.setAccessories(List.of("Khăn đóng truyền thống"));
        assertEquals("COMPLIANT", service.validateOutfit(request).getStatus());
    }

    @Test
    void missingRulesAndContextNeverReceiveACompliantStamp() {
        assertEquals("CAUTION", service.validateOutfit(request("Y phục mới", "female")).getStatus());
        var request = request("Áo Dài", "female");
        request.setAccessories(List.of("Phụ kiện mới"));
        assertEquals("CAUTION", service.validateOutfit(request).getStatus());
        request.setAccessories(List.of()); request.setOccasion("");
        assertEquals("CAUTION", service.validateOutfit(request).getStatus());
    }

    @Test
    void colorCautionDoesNotEraseGenderConflictAndTuThanIncludesMuseumSource() {
        var request = request("Áo Nhật Bình", "male");
        request.setColor("#D4AF37");
        assertEquals("NON_COMPLIANT", service.validateOutfit(request).getStatus());
        request.setGender("female");
        assertEquals("CAUTION", service.validateOutfit(request).getStatus());
        assertFalse(service.validateOutfit(request("Áo Tứ Thân", "male")).getSources().isEmpty());
    }
}
