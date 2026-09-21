package com.vietphucstudio.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OutfitResponse {

    private Long id;
    private Long userId;
    private String name;
    private String occasion;
    private String region;
    private String style;
    private String primaryGarment;
    private List<String> colors;
    private List<String> accessories;
    private String culturalNotes;
    private String status;
    private String visibility;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OutfitResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
