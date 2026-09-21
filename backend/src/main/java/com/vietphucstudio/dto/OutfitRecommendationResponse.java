package com.vietphucstudio.dto;

import java.util.List;

public class OutfitRecommendationResponse {

    private String name;
    private String primaryGarment;
    private List<String> garments;
    private List<String> accessories;
    private List<String> colors;
    private String culturalContext;
    private String historicalPeriod;
    private String stylingAdvice;

    public OutfitRecommendationResponse() {}

    public OutfitRecommendationResponse(String name, String primaryGarment, List<String> garments,
                                      List<String> accessories, List<String> colors,
                                      String culturalContext, String historicalPeriod, String stylingAdvice) {
        this.name = name;
        this.primaryGarment = primaryGarment;
        this.garments = garments;
        this.accessories = accessories;
        this.colors = colors;
        this.culturalContext = culturalContext;
        this.historicalPeriod = historicalPeriod;
        this.stylingAdvice = stylingAdvice;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPrimaryGarment() { return primaryGarment; }
    public void setPrimaryGarment(String primaryGarment) { this.primaryGarment = primaryGarment; }

    public List<String> getGarments() { return garments; }
    public void setGarments(List<String> garments) { this.garments = garments; }

    public List<String> getAccessories() { return accessories; }
    public void setAccessories(List<String> accessories) { this.accessories = accessories; }

    public List<String> getColors() { return colors; }
    public void setColors(List<String> colors) { this.colors = colors; }

    public String getCulturalContext() { return culturalContext; }
    public void setCulturalContext(String culturalContext) { this.culturalContext = culturalContext; }

    public String getHistoricalPeriod() { return historicalPeriod; }
    public void setHistoricalPeriod(String historicalPeriod) { this.historicalPeriod = historicalPeriod; }

    public String getStylingAdvice() { return stylingAdvice; }
    public void setStylingAdvice(String stylingAdvice) { this.stylingAdvice = stylingAdvice; }
}
