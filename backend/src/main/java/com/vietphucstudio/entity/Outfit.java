package com.vietphucstudio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "outfits")
public class Outfit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String occasion;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String region;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String style;

    @NotBlank
    @Column(name = "primary_garment", nullable = false, length = 100)
    private String primaryGarment;

    @Column(name = "colors_json", columnDefinition = "TEXT")
    private String colorsJson;

    @Column(name = "accessories_json", columnDefinition = "TEXT")
    private String accessoriesJson;

    @Column(name = "cultural_notes", columnDefinition = "TEXT")
    private String culturalNotes;

    @Column(length = 20)
    private String status = "SAVED";

    @Column(length = 20)
    private String visibility = "PRIVATE";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Outfit() {}

    // Getters and Setters
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

    public String getColorsJson() { return colorsJson; }
    public void setColorsJson(String colorsJson) { this.colorsJson = colorsJson; }

    public String getAccessoriesJson() { return accessoriesJson; }
    public void setAccessoriesJson(String accessoriesJson) { this.accessoriesJson = accessoriesJson; }

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
