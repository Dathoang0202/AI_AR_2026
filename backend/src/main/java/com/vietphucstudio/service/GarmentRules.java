package com.vietphucstudio.service;

import java.text.Normalizer;
import java.util.Locale;

/** Shared classification for suggestions and cultural checks. Unknown items need review. */
final class GarmentRules {
    private GarmentRules() {}

    static String normalized(String value) {
        return value == null ? "" : Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").replace('đ', 'd').replace('Đ', 'D').toLowerCase(Locale.ROOT);
    }

    static boolean supportsGender(String garment, boolean male) {
        String name = normalized(garment);
        boolean femaleVariant = name.contains("nhat binh") || name.contains("tu than") || name.matches(".*\\bnu\\b.*");
        boolean maleVariant = name.matches(".*\\bnam\\b.*");
        return male ? !femaleVariant : !maleVariant;
    }

    static boolean isKnown(String garment) {
        String name = normalized(garment);
        return name.contains("nhat binh") || name.contains("tu than") || name.contains("giao linh")
                || name.contains("ao tac") || name.contains("ngu than") || name.contains("ao dai");
    }

    static boolean supportsOccasion(String garment, String occasion) {
        String context = normalized(occasion);
        return !normalized(garment).contains("nhat binh")
                || !(context.contains("the thao") || context.contains("hang ngay"));
    }
}
