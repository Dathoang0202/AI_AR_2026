package com.vietphucstudio.service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.List;

/** Shared classification for suggestions and cultural checks. Unknown items need review. */
final class GarmentRules {
    private GarmentRules() {}

    static String normalized(String value) {
        return value == null ? "" : Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").replace('đ', 'd').replace('Đ', 'D').toLowerCase(Locale.ROOT);
    }

    static boolean supportsGender(String garment, boolean male) {
        String name = normalized(garment);
        boolean femaleVariant = name.contains("nhat binh") || name.contains("tu than") || name.contains("ao yem")
                || name.contains("phuong bao") || name.matches(".*\\bnu\\b.*");
        boolean maleVariant = name.contains("con mien") || name.contains("hoang bao") || name.contains("bien phuc")
                || name.matches(".*\\bnam\\b.*");
        return male ? !femaleVariant : !maleVariant;
    }

    static boolean isKnown(String garment) {
        String name = normalized(garment);
        return name.contains("nhat binh") || name.contains("tu than") || name.contains("giao linh")
                || name.contains("ao tac") || name.contains("ngu than") || name.contains("ao dai")
                || name.contains("ao ba ba") || name.contains("trang phuc nu thai (thanh hoa)") || isWorkbookGarment(name);
    }

    static boolean isWorkbookGarment(String garment) {
        String name = normalized(garment);
        return List.of("vien linh", "doi kham", "co man", "bo tu", "con mien", "hoang bao", "phuong bao",
                "ao yem", "tran thu", "bien phuc", "mang bao", "vat ho", "ngu lam", "thu kham").stream().anyMatch(name::contains);
    }

    static boolean isCourtGarment(String garment) {
        String name = normalized(garment);
        return List.of("vien linh", "bo tu", "con mien", "hoang bao", "phuong bao", "bien phuc", "mang bao").stream().anyMatch(name::contains);
    }

    static boolean needsSpecificReference(String garment) {
        String name = normalized(garment);
        return List.of("co man", "bien phuc", "ngu lam", "thu kham").stream().anyMatch(name::contains);
    }

    static boolean isHeadwear(String accessory) {
        String name = normalized(accessory);
        return List.of("non la", "khan dong", "quai thao", "mo qua", "canh chuon").stream().anyMatch(name::contains)
                || name.matches(".*\\bman\\b.*");
    }

    static boolean isCourtAccessory(String accessory) {
        String name = normalized(accessory);
        return List.of("canh chuon", "hai cung dinh", "dai ngoc", "kim khanh", "kim bai").stream().anyMatch(name::contains);
    }

    static boolean supportsOccasion(String garment, String occasion) {
        String context = normalized(occasion);
        boolean restricted = normalized(garment).contains("nhat binh") || isCourtGarment(garment);
        if (restricted && (context.contains("the thao") || context.contains("hang ngay"))) return false;
        return !isCourtGarment(garment) || !context.contains("dao pho");
    }
}
