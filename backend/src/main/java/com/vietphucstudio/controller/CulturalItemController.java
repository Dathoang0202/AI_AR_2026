package com.vietphucstudio.controller;

import com.vietphucstudio.dto.ApiResponse;
import com.vietphucstudio.dto.CulturalItemResponse;
import com.vietphucstudio.service.CulturalItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cultural-items")
public class CulturalItemController {

    private final CulturalItemService service;

    public CulturalItemController(CulturalItemService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CulturalItemResponse>>> getAllItems(
            @RequestParam(required = false) String category) {
        List<CulturalItemResponse> list = service.getAllItems(category);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CulturalItemResponse>> getItemById(@PathVariable Long id) {
        CulturalItemResponse item = service.getItemById(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CulturalItemResponse>>> searchItems(
            @RequestParam String query) {
        List<CulturalItemResponse> list = service.searchItems(query);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
