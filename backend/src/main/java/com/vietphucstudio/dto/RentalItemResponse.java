package com.vietphucstudio.dto;

import java.math.BigDecimal;

public class RentalItemResponse {

    private Long id;
    private String name;
    private String category;
    private BigDecimal pricePerDay;
    private String priceDisplay;
    private String availabilityStatus;

    public RentalItemResponse() {}

    public RentalItemResponse(Long id, String name, String category, BigDecimal pricePerDay, String priceDisplay, String availabilityStatus) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.pricePerDay = pricePerDay;
        this.priceDisplay = priceDisplay;
        this.availabilityStatus = availabilityStatus;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(BigDecimal pricePerDay) { this.pricePerDay = pricePerDay; }

    public String getPriceDisplay() { return priceDisplay; }
    public void setPriceDisplay(String priceDisplay) { this.priceDisplay = priceDisplay; }

    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }
}
