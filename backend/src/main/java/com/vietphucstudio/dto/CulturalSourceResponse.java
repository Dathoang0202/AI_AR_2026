package com.vietphucstudio.dto;

public class CulturalSourceResponse {

    private Long id;
    private String title;
    private String publisher;
    private String url;

    public CulturalSourceResponse() {}

    public CulturalSourceResponse(Long id, String title, String publisher, String url) {
        this.id = id;
        this.title = title;
        this.publisher = publisher;
        this.url = url;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
