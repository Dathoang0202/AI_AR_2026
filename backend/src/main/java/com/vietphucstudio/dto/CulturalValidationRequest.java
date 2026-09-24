package com.vietphucstudio.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CulturalValidationRequest {

    @NotBlank(message = "Garment is required")
    private String garment;

    private String color;
    private String occasion;
    private String region;
    private List<String> accessories;

    private String gender;

    public CulturalValidationRequest() {}

    public String getGarment() { return garment; }
    public void setGarment(String garment) { this.garment = garment; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public List<String> getAccessories() { return accessories; }
    public void setAccessories(List<String> accessories) { this.accessories = accessories; }
}
