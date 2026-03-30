package com.travel.product.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * 产品控制器 - 目的地/POI/产品搜索
 */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    /** 目的地列表 */
    @GetMapping("/public/destinations")
    public ResponseEntity<Map<String, Object>> getDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tags) {
        // TODO: 查询数据库
        List<Map<String, Object>> items = new ArrayList<>();
        items.add(Map.of("id", 1, "name", "三亚", "rating", 4.7, "tags", List.of("海边", "度假")));
        items.add(Map.of("id", 2, "name", "丽江", "rating", 4.6, "tags", List.of("古镇", "雪山")));
        return ResponseEntity.ok(Map.of("items", items, "total", items.size()));
    }

    /** 目的地详情 */
    @GetMapping("/public/destinations/{id}")
    public ResponseEntity<Map<String, Object>> getDestinationDetail(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of(
                "id", id, "name", "三亚", "description", "中国最南端的热带滨海旅游城市",
                "best_season", "10月-次年4月", "avg_cost", 3500
        ));
    }

    /** POI列表 */
    @GetMapping("/public/pois")
    public ResponseEntity<List<Map<String, Object>>> getPOIs(
            @RequestParam(required = false) Long destinationId,
            @RequestParam(required = false) String type) {
        List<Map<String, Object>> pois = List.of(
                Map.of("id", 1, "name", "亚龙湾", "type", "scenic", "rating", 4.8),
                Map.of("id", 2, "name", "蜈支洲岛", "type", "scenic", "rating", 4.7)
        );
        return ResponseEntity.ok(pois);
    }

    /** 产品搜索 */
    @GetMapping("/public/search")
    public ResponseEntity<Map<String, Object>> searchProducts(
            @RequestParam String type,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String destination,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(Map.of("items", List.of(), "total", 0));
    }

    /** 攻略列表 */
    @GetMapping("/public/guides")
    public ResponseEntity<Map<String, Object>> getGuides(
            @RequestParam(required = false) Long destinationId,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Map<String, Object>> guides = List.of(
                Map.of("id", 1, "title", "三亚五日深度游攻略", "views", 12500, "likes", 890),
                Map.of("id", 2, "title", "丽江古城+玉龙雪山完美行程", "views", 8900, "likes", 650)
        );
        return ResponseEntity.ok(Map.of("items", guides, "total", guides.size()));
    }
}
