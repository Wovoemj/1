package com.travel.recommend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 智能推荐服务 - 多路召回 + 排序
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendService {

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 获取个性化推荐
     */
    public List<Map<String, Object>> getRecommendations(Long userId, int page, int size) {
        // 1. 检查缓存
        String cacheKey = "recommend:user:" + userId;
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cached = (List<Map<String, Object>>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null && !cached.isEmpty()) {
            return cached.stream().skip((long) page * size).limit(size).collect(Collectors.toList());
        }

        // 2. 多路召回
        List<Map<String, Object>> candidates = new ArrayList<>();
        candidates.addAll(collaborativeFilteringRecall(userId));
        candidates.addAll(contentBasedRecall(userId));
        candidates.addAll(hotItemsRecall());

        // 3. 排序
        List<Map<String, Object>> ranked = rankCandidates(candidates, userId);

        // 4. 缓存结果
        redisTemplate.opsForValue().set(cacheKey, ranked, Duration.ofMinutes(30));

        return ranked.stream().skip((long) page * size).limit(size).collect(Collectors.toList());
    }

    /**
     * 协同过滤召回
     * 基于相似用户的行为推荐
     */
    private List<Map<String, Object>> collaborativeFilteringRecall(Long userId) {
        log.info("协同过滤召回: userId={}", userId);
        // TODO: 实现基于用户-物品矩阵的协同过滤
        // 1. 找到相似用户 (UserCF) 或相似物品 (ItemCF)
        // 2. 取相似用户喜欢但当前用户未交互的物品
        return generateMockItems("collaborative", 10);
    }

    /**
     * 基于内容的召回
     * 根据用户历史偏好推荐相似内容
     */
    private List<Map<String, Object>> contentBasedRecall(Long userId) {
        log.info("内容召回: userId={}", userId);
        // TODO: 基于用户画像和物品特征向量相似度
        return generateMockItems("content", 10);
    }

    /**
     * 热门物品召回
     */
    private List<Map<String, Object>> hotItemsRecall() {
        log.info("热门物品召回");
        // TODO: 从ES获取热门目的地/产品
        return generateMockItems("hot", 5);
    }

    /**
     * 深度学习排序
     */
    private List<Map<String, Object>> rankCandidates(List<Map<String, Object>> candidates, Long userId) {
        // TODO: 使用 DeepFM / DIN 模型排序
        // 特征工程：用户特征 + 物品特征 + 交叉特征
        // 1. 用户画像：年龄、城市、历史偏好
        // 2. 物品特征：类型、价格、评分、标签
        // 3. 交叉特征：用户对该类型的点击率/购买率

        // 按评分排序（模拟）
        return candidates.stream()
                .sorted((a, b) -> Double.compare(
                        (Double) b.getOrDefault("score", 0.0),
                        (Double) a.getOrDefault("score", 0.0)))
                .distinct()
                .limit(20)
                .collect(Collectors.toList());
    }

    /**
     * 获取相似推荐
     */
    public List<Map<String, Object>> getSimilarItems(Long itemId, String itemType, int size) {
        log.info("获取相似物品: itemId={}, type={}", itemId, itemType);
        // TODO: 基于物品特征向量的相似度计算
        return generateMockItems("similar", size);
    }

    /**
     * 获取热门推荐
     */
    public List<Map<String, Object>> getHotItems(String type, int page, int size) {
        log.info("获取热门物品: type={}", type);
        return generateMockItems("hot", size);
    }

    /**
     * 获取猜你喜欢
     */
    public List<Map<String, Object>> getGuessYouLike(Long userId, int size) {
        log.info("猜你喜欢: userId={}", userId);
        return getRecommendations(userId, 0, size);
    }

    private List<Map<String, Object>> generateMockItems(String source, int count) {
        List<Map<String, Object>> items = new ArrayList<>();
        String[] destinations = {"三亚", "丽江", "北京", "上海", "成都", "西安", "桂林", "厦门"};
        for (int i = 0; i < count && i < destinations.length; i++) {
            items.add(Map.of(
                    "id", (long) (i + 1),
                    "type", "destination",
                    "name", destinations[i],
                    "score", 0.95 - (i * 0.05),
                    "source", source
            ));
        }
        return items;
    }
}
