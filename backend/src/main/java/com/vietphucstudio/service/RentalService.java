package com.vietphucstudio.service;

import com.vietphucstudio.dto.RentalItemResponse;
import com.vietphucstudio.dto.RentalProviderResponse;
import com.vietphucstudio.entity.RentalProvider;
import com.vietphucstudio.exception.ResourceNotFoundException;
import com.vietphucstudio.repository.RentalProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RentalService {

    private final RentalProviderRepository repository;

    public RentalService(RentalProviderRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<RentalProviderResponse> getProviders(String city) {
        List<RentalProvider> list;
        if (city != null && !city.isBlank()) {
            list = repository.findByCityContainingIgnoreCase(city);
        } else {
            list = repository.findAll();
        }
        return list.stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public RentalProviderResponse getProviderById(Long id) {
        RentalProvider provider = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy điểm thuê trang phục"));
        return mapToResponse(provider);
    }

    private RentalProviderResponse mapToResponse(RentalProvider provider) {
        RentalProviderResponse res = new RentalProviderResponse();
        res.setId(provider.getId());
        res.setName(provider.getName());
        res.setAddress(provider.getAddress());
        res.setCity(provider.getCity());
        res.setLatitude(provider.getLatitude());
        res.setLongitude(provider.getLongitude());
        res.setPhone(provider.getPhone());
        res.setWebsite(provider.getWebsite());
        res.setIsDemoData(provider.getIsDemoData());

        if (provider.getItems() != null) {
            res.setItems(provider.getItems().stream()
                    .map(i -> new RentalItemResponse(i.getId(), i.getName(), i.getCategory(), i.getPricePerDay(), i.getAvailabilityStatus()))
                    .toList());
        } else {
            res.setItems(List.of());
        }

        return res;
    }
}
