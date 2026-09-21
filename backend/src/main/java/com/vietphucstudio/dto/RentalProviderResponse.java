package com.vietphucstudio.dto;

import java.math.BigDecimal;
import java.util.List;

public class RentalProviderResponse {

    private Long id;
    private String name;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private String phone;
    private String website;
    private Boolean isDemoData;
    private List<RentalItemResponse> items;

    public RentalProviderResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public Boolean getIsDemoData() { return isDemoData; }
    public void setIsDemoData(Boolean isDemoData) { this.isDemoData = isDemoData; }

    public List<RentalItemResponse> getItems() { return items; }
    public void setItems(List<RentalItemResponse> items) { this.items = items; }
}
