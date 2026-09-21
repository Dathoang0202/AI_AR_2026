package com.vietphucstudio.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cultural_items")
public class CulturalItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // GARMENT, ACCESSORY, REGION, PERIOD, CEREMONY

    @Column(length = 50)
    private String region;

    @Column(name = "historical_period", length = 100)
    private String historicalPeriod;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String significance;

    @OneToMany(mappedBy = "culturalItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CulturalSource> sources = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public CulturalItem() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getHistoricalPeriod() { return historicalPeriod; }
    public void setHistoricalPeriod(String historicalPeriod) { this.historicalPeriod = historicalPeriod; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSignificance() { return significance; }
    public void setSignificance(String significance) { this.significance = significance; }

    public List<CulturalSource> getSources() { return sources; }
    public void setSources(List<CulturalSource> sources) { this.sources = sources; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
