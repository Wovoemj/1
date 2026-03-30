package com.travel.controller;

import com.travel.dto.*;
import com.travel.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户服务控制器
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 手机号验证码登录
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(userService.login(request));
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/profile")
    public ApiResponse<UserDTO> getProfile(@RequestAttribute("userId") Long userId) {
        return ApiResponse.success(userService.getProfile(userId));
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/profile")
    public ApiResponse<UserDTO> updateProfile(
            @RequestAttribute("userId") Long userId,
            @Valid @RequestBody UpdateUserRequest request) {
        return ApiResponse.success(userService.updateProfile(userId, request));
    }

    /**
     * 发送验证码
     */
    @PostMapping("/send-code")
    public ApiResponse<Void> sendCode(@Valid @RequestBody SendCodeRequest request) {
        userService.sendVerificationCode(request.getPhone());
        return ApiResponse.ok();
    }
}
