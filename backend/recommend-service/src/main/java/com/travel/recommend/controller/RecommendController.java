package com.travel.recommend.controller;

import com.travel.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    /**
     * 个性化推荐
     */
    @GetMapping("/personalized")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(recommendService.getRecommendations(userId, page, size));
    }

    /**
     * 相似推荐
     */
    @GetMapping("/similar/{itemId}")
    public ResponseEntity<List<Map<String, Object>>> getSimilarItems(
            @PathVariable Long itemId,
            @RequestParam String type,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(recommendService.getSimilarItems(itemId, type, size));
    }

    /**
     * 热门推荐
     */
    @GetMapping("/hot")
    public ResponseEntity<List<Map<String, Object>>> getHotItems(
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(recommendService.getHotItems(type, page, size));
    }

    /**
     * 猜你喜欢
     */
    @GetMapping("/guess-you-like")
    public ResponseEntity<List<Map<String, Object>>> guessYouLike(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(recommendService.getGuessYouLike(userId, size));
    }
}
