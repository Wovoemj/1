package com.travel.controller;

import com.travel.dto.*;
import com.travel.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

/**
 * AI服务控制器 - 核心AI能力接口
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    /**
     * AI对话接口 - 流式响应
     */
    @PostMapping("/chat")
    public ApiResponse<ChatResponse> chat(
            @RequestAttribute(value = "userId", required = false) Long userId,
            @Valid @RequestBody ChatRequest request) {
        return ApiResponse.success(aiService.chat(userId, request));
    }

    /**
     * 获取对话历史
     */
    @GetMapping("/history/{sessionId}")
    public ApiResponse<java.util.List<ChatMessageDTO>> getHistory(@PathVariable String sessionId) {
        return ApiResponse.success(aiService.getHistory(sessionId));
    }

    /**
     * AI生成行程
     */
    @PostMapping("/generate-itinerary")
    public ApiResponse<ItineraryDTO> generateItinerary(
            @RequestAttribute("userId") Long userId,
            @Valid @RequestBody GenerateItineraryRequest request) {
        return ApiResponse.success(aiService.generateItinerary(userId, request));
    }

    /**
     * AI图片识别
     */
    @PostMapping("/image-recognition")
    public ApiResponse<ImageRecognitionResult> recognizeImage(
            @RequestParam("image") org.springframework.web.multipart.MultipartFile image) {
        return ApiResponse.success(aiService.recognizeImage(image));
    }

    /**
     * 实时翻译
     */
    @PostMapping("/translate")
    public ApiResponse<TranslationResult> translate(@Valid @RequestBody TranslateRequest request) {
        return ApiResponse.success(aiService.translate(request));
    }
}
