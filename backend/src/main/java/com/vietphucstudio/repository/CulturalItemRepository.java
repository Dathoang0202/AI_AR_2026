package com.vietphucstudio.repository;

import com.vietphucstudio.entity.CulturalItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CulturalItemRepository extends JpaRepository<CulturalItem, Long> {
    List<CulturalItem> findByCategory(String category);
    List<CulturalItem> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}
