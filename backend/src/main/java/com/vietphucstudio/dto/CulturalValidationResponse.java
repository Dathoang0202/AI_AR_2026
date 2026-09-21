package com.vietphucstudio.dto;

import java.util.List;

public class CulturalValidationResponse {

    private String status; // COMPLIANT, CAUTION, NON_COMPLIANT
    private List<String> issues;
    private List<String> notes;
    private List<CulturalSourceDto> sources;

    public CulturalValidationResponse() {}

    public CulturalValidationResponse(String status, List<String> issues, List<String> notes, List<CulturalSourceDto> sources) {
        this.status = status;
        this.issues = issues;
        this.notes = notes;
        this.sources = sources;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getIssues() { return issues; }
    public void setIssues(List<String> issues) { this.issues = issues; }

    public List<String> getNotes() { return notes; }
    public void setNotes(List<String> notes) { this.notes = notes; }

    public List<CulturalSourceDto> getSources() { return sources; }
    public void setSources(List<CulturalSourceDto> sources) { this.sources = sources; }

    public static class CulturalSourceDto {
        private String title;
        private String publisher;
        private String url;

        public CulturalSourceDto() {}

        public CulturalSourceDto(String title, String publisher, String url) {
            this.title = title;
            this.publisher = publisher;
            this.url = url;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getPublisher() { return publisher; }
        public void setPublisher(String publisher) { this.publisher = publisher; }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }
}
