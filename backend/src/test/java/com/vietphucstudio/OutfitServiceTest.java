package com.vietphucstudio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vietphucstudio.dto.*;
import com.vietphucstudio.entity.Outfit;
import com.vietphucstudio.repository.OutfitRepository;
import com.vietphucstudio.service.CulturalValidationService;
import com.vietphucstudio.service.OutfitService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OutfitServiceTest {

    @Mock
    private OutfitRepository outfitRepository;

    private OutfitService outfitService;
    private CulturalValidationService validationService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        outfitService = new OutfitService(outfitRepository, objectMapper);
        validationService = new CulturalValidationService();
    }

    @Test
    void testGenerateRecommendations_Success() {
        OutfitPreferenceRequest request = new OutfitPreferenceRequest();
        request.setOccasion("Lễ cưới truyền thống");
        request.setRegion("Miền Bắc");
        request.setStyle("Hoàng gia");

        List<OutfitRecommendationResponse> recommendations = outfitService.generateRecommendations(request);

        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());
        assertTrue(recommendations.stream().anyMatch(r -> r.getPrimaryGarment().contains("Nhật Bình")));
    }

    @Test
    void testValidateOutfit_CulturalCompliance() {
        CulturalValidationRequest request = new CulturalValidationRequest();
        request.setGarment("Áo Nhật Bình");
        request.setColor("Màu Đỏ Nhạt");
        request.setOccasion("Lễ cưới truyền thống");

        CulturalValidationResponse response = validationService.validateOutfit(request);

        assertNotNull(response);
        assertEquals("COMPLIANT", response.getStatus());
        assertFalse(response.getNotes().isEmpty());
    }

    @Test
    void testSaveOutfit_Success() {
        CreateOutfitRequest request = new CreateOutfitRequest();
        request.setName("Bộ Nhật Bình Cực Đẹp");
        request.setOccasion("Lễ cưới");
        request.setRegion("Miền Trung");
        request.setStyle("Hoàng gia");
        request.setPrimaryGarment("Áo Nhật Bình");
        request.setColors(List.of("#D4AF37", "#C0392B"));
        request.setAccessories(List.of("Mấn chỉ vàng"));

        Outfit mockSavedOutfit = new Outfit();
        mockSavedOutfit.setId(1L);
        mockSavedOutfit.setUserId(100L);
        mockSavedOutfit.setName(request.getName());
        mockSavedOutfit.setOccasion(request.getOccasion());
        mockSavedOutfit.setRegion(request.getRegion());
        mockSavedOutfit.setStyle(request.getStyle());
        mockSavedOutfit.setPrimaryGarment(request.getPrimaryGarment());

        when(outfitRepository.save(any(Outfit.class))).thenReturn(mockSavedOutfit);

        OutfitResponse response = outfitService.saveOutfit(100L, request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Bộ Nhật Bình Cực Đẹp", response.getName());

        ArgumentCaptor<Outfit> captor = ArgumentCaptor.forClass(Outfit.class);
        verify(outfitRepository).save(captor.capture());
        assertEquals(100L, captor.getValue().getUserId());
    }
}
