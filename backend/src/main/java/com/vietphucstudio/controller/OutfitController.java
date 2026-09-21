package com.vietphucstudio.controller;

import com.vietphucstudio.dto.*;
import com.vietphucstudio.security.UserPrincipal;
import com.vietphucstudio.service.CulturalValidationService;
import com.vietphucstudio.service.OutfitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/outfits")
public class OutfitController {

    private final OutfitService outfitService;
    private final CulturalValidationService validationService;

    public OutfitController(OutfitService outfitService, CulturalValidationService validationService) {
        this.outfitService = outfitService;
        this.validationService = validationService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<List<OutfitRecommendationResponse>>> recommend(
            @Valid @RequestBody OutfitPreferenceRequest request) {
        List<OutfitRecommendationResponse> recommendations = outfitService.generateRecommendations(request);
        return ResponseEntity.ok(ApiResponse.success(recommendations));
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CulturalValidationResponse>> validate(
            @Valid @RequestBody CulturalValidationRequest request) {
        CulturalValidationResponse validation = validationService.validateOutfit(request);
        return ResponseEntity.ok(ApiResponse.success(validation));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OutfitResponse>> saveOutfit(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateOutfitRequest request) {
        OutfitResponse outfit = outfitService.saveOutfit(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(outfit));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OutfitResponse>>> getUserOutfits(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<OutfitResponse> outfits = outfitService.getUserOutfits(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(outfits));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OutfitResponse>> getOutfitById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        OutfitResponse outfit = outfitService.getOutfitById(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(outfit));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OutfitResponse>> updateOutfit(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody CreateOutfitRequest request) {
        OutfitResponse outfit = outfitService.updateOutfit(id, userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(outfit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOutfit(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        outfitService.deleteOutfit(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
