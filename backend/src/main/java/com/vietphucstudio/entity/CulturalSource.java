package com.vietphucstudio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cultural_sources")
public class CulturalSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultural_item_id", nullable = false)
    private CulturalItem culturalItem;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 150)
    private String publisher;

    @Column(length = 500)
    private String url;

    public CulturalSource() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CulturalItem getCulturalItem() { return culturalItem; }
    public void setCulturalItem(CulturalItem culturalItem) { this.culturalItem = culturalItem; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
