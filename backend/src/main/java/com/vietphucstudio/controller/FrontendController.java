package com.vietphucstudio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class FrontendController {

    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    @GetMapping({"/assistant", "/assistant/"})
    public String assistant() {
        return "forward:/assistant.html";
    }

    @GetMapping({"/cultural", "/cultural/"})
    public String cultural() {
        return "forward:/cultural.html";
    }

    @GetMapping({"/cultural/detail", "/cultural/detail/"})
    public String culturalDetail() {
        return "forward:/cultural/detail.html";
    }

    @GetMapping("/cultural/{id:[0-9]+}")
    public String legacyCulturalDetail(@PathVariable String id) {
        return "redirect:/cultural/detail?id=" + id;
    }

    @GetMapping({"/lookbook", "/lookbook/"})
    public String lookbook() {
        return "forward:/lookbook.html";
    }

    @GetMapping({"/onboarding", "/onboarding/"})
    public String onboarding() {
        return "forward:/onboarding.html";
    }

    @GetMapping({"/rentals", "/rentals/"})
    public String rentals() {
        return "forward:/rentals.html";
    }

    @GetMapping({"/studio", "/studio/"})
    public String studio() {
        return "forward:/studio.html";
    }
}
