package com.vietphucstudio.repository;

import com.vietphucstudio.entity.RentalProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalProviderRepository extends JpaRepository<RentalProvider, Long> {
    List<RentalProvider> findByCityContainingIgnoreCase(String city);
}
