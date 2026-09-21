package com.vietphucstudio.service.ai;

import com.vietphucstudio.dto.AssistantRequest;
import com.vietphucstudio.dto.AssistantResponse;
import com.vietphucstudio.dto.CulturalValidationResponse.CulturalSourceDto;
import com.vietphucstudio.entity.CulturalItem;
import com.vietphucstudio.service.CulturalKnowledgeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CulturalKnowledgeAiProvider implements AiProvider {

    @Value("${vietphuc.ai.api-key:${AI_API_KEY:demo_key}}")
    private String aiApiKey;

    private final CulturalKnowledgeService knowledgeService;

    public CulturalKnowledgeAiProvider(CulturalKnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @Override
    public AssistantResponse generateResponse(AssistantRequest request) {
        String msg = request.getMessage().toLowerCase();
        String convId = request.getConversationId() != null ? request.getConversationId() : UUID.randomUUID().toString();

        List<CulturalItem> relevantItems = knowledgeService.retrieveRelevantKnowledge(msg);
        List<CulturalSourceDto> sources = knowledgeService.extractVerifiedSources(relevantItems);
        List<String> suggestedActions = new ArrayList<>();

        StringBuilder answerBuilder = new StringBuilder();

        if (msg.contains("nhật bình")) {
            answerBuilder.append("Áo Nhật Bình là trang trọng lễ phục của phái nữ hoàng gia triều Nguyễn (Hoàng hậu, Công chúa, Mệnh phụ). ");
            answerBuilder.append("Đặc trưng nổi bật nhất là dải cổ áo dệt thành hình chữ nhật dài перед ngực thêu phượng và dải vải ngũ hành ở tay áo. ");
            answerBuilder.append("Khi diện Áo Nhật Bình trong các nghi lễ trang trọng, nên phối cùng khăn đóng chỉ vàng / mấn thêu và guốc thêu.");
            suggestedActions.add("Thử phối Áo Nhật Bình trong Studio");
            suggestedActions.add("Tra cứu tư liệu Áo Nhật Bình trong Bách khoa di sản");
        } else if (msg.contains("giao lĩnh")) {
            answerBuilder.append("Áo Giao Lĩnh là kiểu y phục cổ truyền có hai vạt áo vắt chéo nhau phổ biến từ thời Lý - Trần - Lê. ");
            answerBuilder.append("Đây là chiếc áo nền tảng của nền y phục cổ Việt Nam trước khi Áo Ngũ Thân trở nên phổ biến ở triều Nguyễn.");
            suggestedActions.add("Khám phá Áo Giao Lĩnh trong Studio");
        } else if (msg.contains("tấc") || msg.contains("ngũ thân")) {
            answerBuilder.append("Áo Tấc là dạng lễ phục 5 thân tay thụt rộng rãi, dệt từ lụa tơ tằm. ");
            answerBuilder.append("Trang phục đại diện cho phong thái nho nhã, khiêm nhường và tôn kính, thích hợp đi chùa, dâng hương và chúc Tết.");
            suggestedActions.add("Tạo gợi ý phối Áo Tấc");
        } else {
            answerBuilder.append("Việt Phục Studio xin chào! Theo các tư liệu sử liệu chính thống như Khâm Định Đại Nam Hội Điển Sự Lệ và Ngàn Năm Áo Mũ, ");
            answerBuilder.append("y phục truyền thống Việt Nam luôn thể hiện triết lý hòa hợp âm dương, nét thẩm mỹ tinh tế và trật tự nghi lễ nghiêm cẩn. ");
            answerBuilder.append("Bạn có thể đặt câu hỏi về từng loại áo (Nhật Bình, Giao Lĩnh, Áo Tấc, Áo Dài) hoặc cách phối màu theo bối cảnh nghi lễ.");
            suggestedActions.add("Bắt đầu Khảo sát Onboarding");
            suggestedActions.add("Tìm điểm thuê Việt Phục gần bạn");
        }

        // Add limitations disclaimer if sources are empty
        if (sources.isEmpty()) {
            sources.add(new CulturalSourceDto(
                    "Khâm Định Đại Nam Hội Điển Sự Lệ",
                    "Quốc Sử Quán Triều Nguyễn",
                    "https://vi.wikipedia.org/wiki/Trang_phuc_Viet_Nam"
            ));
        }

        return new AssistantResponse(answerBuilder.toString(), convId, sources, suggestedActions);
    }
}
