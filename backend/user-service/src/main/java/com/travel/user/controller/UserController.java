package com.travel.user.controller;

import com.travel.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 发送验证码 */
    @PostMapping("/sms/send")
    public ResponseEntity<Map<String, Object>> sendSms(@RequestParam String phone) {
        boolean success = userService.sendSmsCode(phone);
        return ResponseEntity.ok(Map.of("success", success));
    }

    /** 登录 */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(userService.login(req.get("phone"), req.get("code")));
    }

    /** 注册 */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(userService.login(req.get("phone"), req.get("code")));
    }

    /** 获取用户信息 */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    /** 更新用户信息 */
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(userService.updateProfile(userId, data));
    }
}
