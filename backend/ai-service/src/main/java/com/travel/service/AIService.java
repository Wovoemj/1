package com.travel.service;

import com.travel.dto.*;
import com.travel.repository.AiConversationRepository;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

/**
 * AI核心服务 - 基于LangChain4j实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

    private final ChatLanguageModel chatModel;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final AiConversationRepository conversationRepository;

    /**
     * AI对话 - 支持RAG检索增强
     */
    public ChatResponse chat(Long userId, ChatRequest request) {
        // 1. 意图识别
        String intent = detectIntent(request.getMessage());

        // 2. RAG检索 - 从向量库检索相关知识
        String context = retrieveContext(request.getMessage());

        // 3. 构建Prompt
        String systemPrompt = buildSystemPrompt(intent, context);

        // 4. 调用LLM
        String response = chatModel.generate(
                List.of(
                    dev.langchain4j.data.message.SystemMessage.from(systemPrompt),
                    dev.langchain4j.data.message.UserMessage.from(request.getMessage())
                )
        ).content().text();

        // 5. 保存对话历史
        saveConversation(userId, request.getSessionId(), "user", request.getMessage(), intent);
        saveConversation(userId, request.getSessionId(), "assistant", response, intent);

        // 6. 生成建议
        List<String> suggestions = generateSuggestions(intent, request.getMessage());

        return new ChatResponse(response, intent, suggestions);
    }

    /**
     * AI生成行程
     */
    public ItineraryDTO generateItinerary(Long userId, GenerateItineraryRequest request) {
        // 1. 检索目的地POI信息
        String poiContext = retrievePOIInfo(request.getDestination(), request.getDays());

        // 2. 构建行程生成Prompt
        String prompt = buildItineraryPrompt(request, poiContext);

        // 3. 调用LLM生成行程
        String result = chatModel.generate(prompt);

        // 4. 解析并结构化行程
        ItineraryDTO itinerary = parseItinerary(result, request);

        return itinerary;
    }

    /**
     * 图片识别 - 识别景点
     */
    public ImageRecognitionResult recognizeImage(MultipartFile image) {
        // TODO: 集成多模态模型进行图片识别
        // 1. 调用视觉模型识别图片内容
        // 2. 匹配已知景点
        // 3. 返回识别结果和相关攻略
        return new ImageRecognitionResult("三亚亚龙湾", 0.95, List.of("亚龙湾攻略"));
    }

    /**
     * 实时翻译
     */
    public TranslationResult translate(TranslateRequest request) {
        String prompt = String.format(
            "请将以下%s文本翻译为%s，只返回翻译结果：\n%s",
            request.getFromLang(), request.getToLang(), request.getText()
        );
        String translated = chatModel.generate(prompt);
        return new TranslationResult(translated, request.getFromLang(), request.getToLang());
    }

    // ==================== 私有方法 ====================

    private String detectIntent(String message) {
        String prompt = """
            分析以下用户消息的意图，只返回意图标签之一：
            [greeting, itinerary, booking, recommendation, complaint, faq, translation, other]
            
            用户消息：""" + message;
        return chatModel.generate(prompt).trim().toLowerCase();
    }

    private String retrieveContext(String query) {
        try {
            Embedding embedding = embeddingModel.embed(query).content();
            var results = embeddingStore.search(
                dev.langchain4j.store.embedding.EmbeddingSearchRequest.builder()
                    .queryEmbedding(embedding)
                    .maxResults(3)
                    .build()
            );
            StringBuilder context = new StringBuilder();
            for (var match : results.matches()) {
                context.append(match.embedded().text()).append("\n");
            }
            return context.toString();
        } catch (Exception e) {
            log.warn("向量检索失败: {}", e.getMessage());
            return "";
        }
    }

    private String buildSystemPrompt(String intent, String context) {
        return """
            你是「智旅」AI旅行助手，一个专业、友好的旅游顾问。
            
            规则：
            1. 基于提供的参考信息回答问题
            2. 如果信息不足，诚实告知并提供一般性建议
            3. 回答要简洁实用，使用适当的emoji增加可读性
            4. 推荐时要考虑用户偏好和预算
            5. 不要编造不存在的景点或价格
            
            当前意图：%s
            
            参考信息：
            %s
            """.formatted(intent, context);
    }

    private String buildItineraryPrompt(GenerateItineraryRequest request, String poiContext) {
        return """
            请为以下旅行需求生成详细行程：
            
            目的地：%s
            天数：%d天
            预算：%s元/人
            风格：%s
            特殊要求：%s
            
            目的地POI信息：
            %s
            
            请按以下JSON格式返回：
            {
              "title": "行程标题",
              "days": [
                {
                  "day": 1,
                  "date": "YYYY-MM-DD",
                  "activities": [
                    {
                      "time": "HH:mm",
                      "title": "活动名称",
                      "description": "详细描述",
                      "location": "地点",
                      "duration": 分钟,
                      "cost": 费用,
                      "type": "attraction|restaurant|transport|hotel|activity"
                    }
                  ]
                }
              ],
              "estimatedBudget": 预算明细
            }
            """.formatted(
                request.getDestination(),
                request.getDays(),
                request.getBudget(),
                request.getStyle(),
                request.getRequirements(),
                poiContext
            );
    }

    private String retrievePOIInfo(String destination, int days) {
        try {
            String query = destination + "旅游景点推荐";
            Embedding embedding = embeddingModel.embed(query).content();
            var results = embeddingStore.search(
                dev.langchain4j.store.embedding.EmbeddingSearchRequest.builder()
                    .queryEmbedding(embedding)
                    .maxResults(10)
                    .minScore(0.6)
                    .build()
            );
            StringBuilder info = new StringBuilder();
            for (var match : results.matches()) {
                info.append("- ").append(match.embedded().text()).append("\n");
            }
            return info.toString();
        } catch (Exception e) {
            return "暂无详细POI信息";
        }
    }

    private ItineraryDTO parseItinerary(String llmResult, GenerateItineraryRequest request) {
        // TODO: 使用JSON解析LLM返回的行程数据
        ItineraryDTO dto = new ItineraryDTO();
        dto.setTitle(request.getDestination() + request.getDays() + "日游");
        dto.setDestination(request.getDestination());
        dto.setDays(request.getDays());
        return dto;
    }

    private List<String> generateSuggestions(String intent, String message) {
        return switch (intent) {
            case "itinerary" -> List.of("推荐酒店", "当地美食", "交通攻略");
            case "booking" -> List.of("查看价格趋势", "筛选条件", "取消政策");
            case "recommendation" -> List.of("更多推荐", "查看评价", "预算筛选");
            default -> List.of("行程规划", "预订服务", "旅行攻略");
        };
    }

    private void saveConversation(Long userId, String sessionId, String role, String content, String intent) {
        try {
            com.travel.model.AiConversation conv = new com.travel.model.AiConversation();
            conv.setUserId(userId);
            conv.setSessionId(sessionId);
            conv.setRole(role);
            conv.setContent(content);
            conv.setIntent(intent);
            conversationRepository.insert(conv);
        } catch (Exception e) {
            log.warn("保存对话历史失败: {}", e.getMessage());
        }
    }
}
