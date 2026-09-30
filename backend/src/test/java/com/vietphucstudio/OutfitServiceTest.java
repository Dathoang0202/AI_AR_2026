package com.vietphucstudio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vietphucstudio.dto.*;
import com.vietphucstudio.entity.Outfit;
import com.vietphucstudio.entity.CulturalItem;
import com.vietphucstudio.repository.CulturalItemRepository;
import com.vietphucstudio.exception.BusinessRuleException;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OutfitServiceTest {

    @Mock
    private OutfitRepository outfitRepository;

    @Mock
    private CulturalItemRepository culturalItemRepository;

    private OutfitService outfitService;
    private CulturalValidationService validationService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        outfitService = new OutfitService(outfitRepository, objectMapper, culturalItemRepository);
        validationService = new CulturalValidationService();
    }

    @Test
    void testGenerateRecommendations_Success() {
        when(culturalItemRepository.findByCategory("GARMENT")).thenReturn(List.of(
                garment(1L, "Áo Nhật Bình"), garment(3L, "Áo Tấc"), garment(6L, "Áo Dài")));
        OutfitPreferenceRequest request = new OutfitPreferenceRequest();
        request.setOccasion("Lễ cưới truyền thống");
        request.setRegion("Miền Bắc");
        request.setStyle("Hoàng gia");

        List<OutfitRecommendationResponse> recommendations = outfitService.generateRecommendations(request);

        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());
        assertTrue(recommendations.stream().anyMatch(r -> r.getPrimaryGarment().contains("Nhật Bình")));
        assertEquals(1L, recommendations.get(0).getCulturalItemId());
    }

    @Test
    void recommendationsKeepMuseumIdentityCustomColorsAndAccessories() {
        when(culturalItemRepository.findByCategory("GARMENT")).thenReturn(List.of(garment(5L, "Áo Tứ Thân"), garment(6L, "Áo Dài")));
        CulturalItem headwear = garment(4L, "Mấn & Khăn Đóng Truyền Thống");
        headwear.setCategory("ACCESSORY");
        when(culturalItemRepository.findByCategory("ACCESSORY")).thenReturn(List.of(headwear));
        OutfitPreferenceRequest request = new OutfitPreferenceRequest();
        request.setCulturalItemId(5L);
        request.setGender("female");
        request.setPreferredColors(List.of("#8256ab", "#123456", "#8256AB"));
        List<OutfitRecommendationResponse> result = outfitService.generateRecommendations(request);
        assertEquals(1, result.size());
        assertEquals(5L, result.get(0).getCulturalItemId());
        assertEquals("Áo Tứ Thân", result.get(0).getPrimaryGarment());
        assertEquals(List.of("#8256AB", "#123456"), result.get(0).getColors());
        assertEquals(List.of("Mấn truyền thống"), result.get(0).getAccessories());
        assertEquals("/images/test-5.jpg", result.get(0).getImageUrl());
    }

    @Test
    void newlyAddedMuseumGarmentCanBeRecommendedWithoutChangingCode() {
        when(culturalItemRepository.findByCategory("GARMENT")).thenReturn(List.of(garment(42L, "Y phục mới")));
        OutfitPreferenceRequest request = new OutfitPreferenceRequest();
        request.setCulturalItemId(42L);
        assertEquals("Y phục mới", outfitService.generateRecommendations(request).get(0).getPrimaryGarment());
    }

    @Test
    void maleRecommendationsExcludeFemaleSpecificGarments() {
        when(culturalItemRepository.findByCategory("GARMENT")).thenReturn(List.of(
                garment(1L, "Áo Nhật Bình"), garment(5L, "Áo Tứ Thân"), garment(3L, "Áo Tấc")));
        OutfitPreferenceRequest request = new OutfitPreferenceRequest();
        request.setGender("male");
        assertEquals(List.of(3L), outfitService.generateRecommendations(request).stream().map(OutfitRecommendationResponse::getCulturalItemId).toList());
        request.setCulturalItemId(1L);
        assertThrows(BusinessRuleException.class, () -> outfitService.generateRecommendations(request));
    }

    @Test
    void contextAndStyleChooseDifferentLeadingGarmentsWithoutPreselection() {
        when(culturalItemRepository.findByCategory("GARMENT")).thenReturn(List.of(
                garment(1L, "Áo Nhật Bình"), garment(5L, "Áo Tứ Thân"), garment(6L, "Áo Dài")));
        OutfitPreferenceRequest request = new OutfitPreferenceRequest();
        request.setGender("female"); request.setRegion("Miền Bắc"); request.setOccasion("Chụp ảnh di sản / nghệ thuật");
        request.setStyle("Dân gian Mộc mạc");
        assertEquals(5L, outfitService.generateRecommendations(request).get(0).getCulturalItemId());
        request.setStyle("Tân thời Duyên dáng");
        assertEquals(6L, outfitService.generateRecommendations(request).get(0).getCulturalItemId());
        request.setOccasion("Sinh hoạt hằng ngày"); request.setStyle("Cổ điển Hoàng gia");
        assertTrue(outfitService.generateRecommendations(request).stream().noneMatch(item -> item.getCulturalItemId().equals(1L)));
    }

    @Test
    void missingOrAccessoryIdsAreRejectedAsPrimaryGarments() {
        when(culturalItemRepository.findByCategory("GARMENT")).thenReturn(List.of(garment(3L, "Áo Tấc")));
        OutfitPreferenceRequest request = new OutfitPreferenceRequest();
        request.setCulturalItemId(4L);
        assertThrows(BusinessRuleException.class, () -> outfitService.generateRecommendations(request));
        request.setCulturalItemId(9999L);
        assertThrows(BusinessRuleException.class, () -> outfitService.generateRecommendations(request));
    }

    private CulturalItem garment(Long id, String name) {
        CulturalItem item = new CulturalItem();
        item.setId(id); item.setName(name); item.setCategory("GARMENT");
        item.setDescription("Tư liệu về " + name); item.setRegion("Miền Bắc");
        item.setImageUrl("/images/test-" + id + ".jpg");
        return item;
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
    void savedPreviewRetainsGenderColorsAndAccessoriesWhenRenamedByOlderClient() {
        CreateOutfitRequest request = new CreateOutfitRequest();
        request.setName("Bộ phối nam"); request.setPrimaryGarment("Áo Tấc");
        request.setOccasion("Dịp Tết"); request.setRegion("Miền Bắc"); request.setStyle("Nho nhã");
        request.setGender("male"); request.setColors(List.of("#123456", "#C0392B"));
        request.setAccessories(List.of("Khăn đóng truyền thống", "Quạt xếp"));
        when(outfitRepository.save(any(Outfit.class))).thenAnswer(call -> call.getArgument(0));
        OutfitResponse saved = outfitService.saveOutfit(100L, request);
        assertEquals("male", saved.getGender());
        assertEquals(request.getColors(), saved.getColors());
        assertEquals(request.getAccessories(), saved.getAccessories());
        ArgumentCaptor<Outfit> captor = ArgumentCaptor.forClass(Outfit.class);
        verify(outfitRepository).save(captor.capture());
        Outfit entity = captor.getValue();
        when(outfitRepository.findByIdAndUserId(1L, 100L)).thenReturn(Optional.of(entity));
        request.setName("Tên mới"); request.setGender(null); request.setColors(null); request.setAccessories(null);
        request.setVisibility("UNLISTED");
        OutfitResponse renamed = outfitService.updateOutfit(1L, 100L, request);
        assertEquals("Tên mới", renamed.getName());
        assertEquals("male", renamed.getGender());
        assertEquals(saved.getColors(), renamed.getColors());
        assertEquals(saved.getAccessories(), renamed.getAccessories());
        assertEquals("UNLISTED", renamed.getVisibility());
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
