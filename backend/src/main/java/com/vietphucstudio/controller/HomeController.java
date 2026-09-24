package com.vietphucstudio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "message", "Việt Phục Studio REST API Server is running successfully!",
                "h2Console", "http://localhost:8080/h2-console",
                "frontendUrl", "http://localhost:3000"
        ));
    }
}
