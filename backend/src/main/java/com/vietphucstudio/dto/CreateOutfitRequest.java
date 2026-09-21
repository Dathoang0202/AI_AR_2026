package com.vietphucstudio.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateOutfitRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Occasion is required")
    private String occasion;

    @NotBlank(message = "Region is required")
    private String region;

    @NotBlank(message = "Style is required")
    private String style;

    @NotBlank(message = "Primary garment is required")
    private String primaryGarment;

    private List<String> colors;
    private List<String> accessories;
    private String culturalNotes;
    private String visibility = "PRIVATE";

    public CreateOutfitRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getPrimaryGarment() { return primaryGarment; }
    public void setPrimaryGarment(String primaryGarment) { this.primaryGarment = primaryGarment; }

    public List<String> getColors() { return colors; }
    public void setColors(List<String> colors) { this.colors = colors; }

    public List<String> getAccessories() { return accessories; }
    public void setAccessories(List<String> accessories) { this.accessories = accessories; }

    public String getCulturalNotes() { return culturalNotes; }
    public void setCulturalNotes(String culturalNotes) { this.culturalNotes = culturalNotes; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
}
