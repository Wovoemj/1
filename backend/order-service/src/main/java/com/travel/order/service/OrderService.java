package com.travel.order.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * 订单服务 - 订单状态机
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final RedisTemplate<String, Object> redisTemplate;

    /** 创建订单 */
    public Map<String, Object> createOrder(Long userId, Long productId, int quantity,
                                           BigDecimal unitPrice, String useDate, String remark) {
        String orderNo = "ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(quantity));

        // 使用Redis分布式锁防超卖
        String lockKey = "lock:product:" + productId;
        Boolean locked = redisTemplate.opsForValue().setIfAbsent(lockKey, "1", 30, TimeUnit.SECONDS);

        try {
            if (Boolean.FALSE.equals(locked)) {
                throw new RuntimeException("系统繁忙，请稍后重试");
            }

            // TODO: 扣减库存、创建订单记录

            // 设置订单超时自动取消（30分钟）
            redisTemplate.opsForValue().set("order:expire:" + orderNo, userId, 30, TimeUnit.MINUTES);

            log.info("订单创建成功: orderNo={}, userId={}, amount={}", orderNo, userId, totalAmount);

            return Map.of(
                    "orderNo", orderNo,
                    "totalAmount", totalAmount,
                    "status", 0, // 待支付
                    "expireTime", LocalDateTime.now().plusMinutes(30)
            );
        } finally {
            if (Boolean.TRUE.equals(locked)) {
                redisTemplate.delete(lockKey);
            }
        }
    }

    /** 取消订单 */
    public Map<String, Object> cancelOrder(String orderNo, Long userId, String reason) {
        log.info("取消订单: orderNo={}, userId={}, reason={}", orderNo, userId, reason);
        // TODO: 更新订单状态、释放库存
        redisTemplate.delete("order:expire:" + orderNo);
        return Map.of("orderNo", orderNo, "status", 2, "cancelTime", LocalDateTime.now());
    }

    /** 支付成功回调 */
    public void onPaymentSuccess(String orderNo) {
        log.info("订单支付成功: orderNo={}", orderNo);
        // TODO: 更新订单状态为已支付
        redisTemplate.delete("order:expire:" + orderNo);
    }

    /** 查询订单 */
    public Map<String, Object> getOrder(String orderNo) {
        // TODO: 从数据库查询
        return Map.of("orderNo", orderNo, "status", 0);
    }

    /** 用户订单列表 */
    public Map<String, Object> getUserOrders(Long userId, Integer status, int page, int size) {
        // TODO: 分页查询
        return Map.of("items", java.util.List.of(), "total", 0, "page", page);
    }
}
