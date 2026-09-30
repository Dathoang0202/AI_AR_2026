package com.vietphucstudio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import java.util.List;

public class OutfitPreferenceRequest {

    @NotBlank(message = "Occasion is required")
    private String occasion; // Lễ cưới, Tết, Chụp ảnh, Lễ hội, Hằng ngày

    @NotBlank(message = "Region is required")
    private String region; // Miền Bắc, Miền Trung, Miền Nam

    private List<String> preferredColors;
    private String style; // Cổ điển, Tân thời, Hoàng gia, Dân gian
    private String rentalIntent; // RENT, BUY, CUSTOMIZE
    @Positive
    private Long culturalItemId;
    @Pattern(regexp = "female|male", message = "Gender must be female or male")
    private String gender;

    public OutfitPreferenceRequest() {}

    public Long getCulturalItemId() { return culturalItemId; }
    public void setCulturalItemId(Long culturalItemId) { this.culturalItemId = culturalItemId; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public List<String> getPreferredColors() { return preferredColors; }
    public void setPreferredColors(List<String> preferredColors) { this.preferredColors = preferredColors; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getRentalIntent() { return rentalIntent; }
    public void setRentalIntent(String rentalIntent) { this.rentalIntent = rentalIntent; }
}
