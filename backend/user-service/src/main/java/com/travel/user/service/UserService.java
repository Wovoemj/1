package com.travel.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 用户服务 - 认证、会员管理
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final RedisTemplate<String, Object> redisTemplate;

    /** 发送验证码 */
    public boolean sendSmsCode(String phone) {
        String code = String.valueOf((int) ((Math.random() * 9 + 1) * 100000));
        redisTemplate.opsForValue().set("sms:code:" + phone, code, 5, TimeUnit.MINUTES);
        log.info("发送验证码: phone={}, code=***");
        // TODO: 调用短信服务
        return true;
    }

    /** 手机号登录 */
    public Map<String, Object> login(String phone, String code) {
        String cachedCode = (String) redisTemplate.opsForValue().get("sms:code:" + phone);
        if (!code.equals(cachedCode)) {
            throw new RuntimeException("验证码错误或已过期");
        }
        redisTemplate.delete("sms:code:" + phone);

        // TODO: 查找或创建用户、生成JWT
        String token = "jwt_token_" + System.currentTimeMillis();
        return Map.of(
                "token", token,
                "user", Map.of(
                        "id", 1,
                        "phone", phone,
                        "nickname", "用户" + phone.substring(7),
                        "membership_level", 0
                )
        );
    }

    /** 获取用户信息 */
    public Map<String, Object> getUserProfile(Long userId) {
        // TODO: 从数据库查询
        return Map.of(
                "id", userId,
                "nickname", "旅行达人",
                "phone", "138****8888",
                "membership_level", 2,
                "points", 2580,
                "travel_style", "深度体验型",
                "preferences", Map.of("destinations", java.util.List.of("海边", "古镇"), "budget", "mid-range")
        );
    }

    /** 更新用户信息 */
    public Map<String, Object> updateProfile(Long userId, Map<String, Object> data) {
        log.info("更新用户信息: userId={}, data={}", userId, data);
        // TODO: 更新数据库
        return Map.of("success", true);
    }
}
