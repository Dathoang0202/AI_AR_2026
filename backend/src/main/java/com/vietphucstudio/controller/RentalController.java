package com.vietphucstudio.controller;

import com.vietphucstudio.dto.ApiResponse;
import com.vietphucstudio.dto.RentalProviderResponse;
import com.vietphucstudio.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rentals")
public class RentalController {

    private final RentalService service;

    public RentalController(RentalService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RentalProviderResponse>>> getProviders(
            @RequestParam(required = false) String city) {
        List<RentalProviderResponse> list = service.getProviders(city);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RentalProviderResponse>> getProviderById(@PathVariable Long id) {
        RentalProviderResponse provider = service.getProviderById(id);
        return ResponseEntity.ok(ApiResponse.success(provider));
    }
}
