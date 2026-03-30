package com.travel.service;

import com.travel.dto.*;
import com.travel.model.User;
import com.travel.repository.UserRepository;
import com.travel.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Random;

/**
 * 用户服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;

    /**
     * 手机号 + 验证码登录
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // 验证验证码
        String cachedCode = redisTemplate.opsForValue().get("sms:code:" + request.getPhone());
        if (cachedCode == null || !cachedCode.equals(request.getCode())) {
            throw new RuntimeException("验证码错误或已过期");
        }

        // 查找或创建用户
        User user = userRepository.findByPhone(request.getPhone())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setPhone(request.getPhone());
                    newUser.setNickname("旅行者" + request.getPhone().substring(7));
                    return userRepository.save(newUser);
                });

        // 生成JWT
        String token = jwtUtil.generateToken(user.getId(), user.getUuid().toString());

        // 清除验证码
        redisTemplate.delete("sms:code:" + request.getPhone());

        return new LoginResponse(token, UserDTO.from(user));
    }

    /**
     * 获取用户信息
     */
    public UserDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        return UserDTO.from(user);
    }

    /**
     * 更新用户信息
     */
    @Transactional
    public UserDTO updateProfile(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (request.getNickname() != null) user.setNickname(request.getNickname());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getBirthday() != null) user.setBirthday(request.getBirthday());
        if (request.getPreferences() != null) user.setPreferences(request.getPreferences());

        userRepository.save(user);
        return UserDTO.from(user);
    }

    /**
     * 发送验证码
     */
    public void sendVerificationCode(String phone) {
        // 生成6位随机验证码
        String code = String.format("%06d", new Random().nextInt(999999));

        // 存入Redis，5分钟过期
        redisTemplate.opsForValue().set("sms:code:" + phone, code, Duration.ofMinutes(5));

        // TODO: 调用短信服务发送验证码
        log.info("验证码已发送到 {}: {}", phone, code);
    }
}
