package com.vietphucstudio.dto;

import java.util.List;

public class CulturalItemResponse {

    private Long id;
    private String name;
    private String category;
    private String region;
    private String historicalPeriod;
    private String description;
    private String significance;
    private List<CulturalSourceResponse> sources;

    public CulturalItemResponse() {}

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

    public List<CulturalSourceResponse> getSources() { return sources; }
    public void setSources(List<CulturalSourceResponse> sources) { this.sources = sources; }
}
