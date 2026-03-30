package com.travel.notification.controller;

import com.travel.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 发送短信验证码
     */
    @PostMapping("/sms/send")
    public ResponseEntity<Map<String, Object>> sendSmsCode(@RequestParam String phone) {
        String code = String.valueOf((int) ((Math.random() * 9 + 1) * 100000));
        boolean success = notificationService.sendSmsCode(phone, code);
        return ResponseEntity.ok(Map.of(
                "success", success,
                "message", success ? "验证码已发送" : "发送失败"
        ));
    }

    /**
     * 发送邮件
     */
    @PostMapping("/email/send")
    public ResponseEntity<Map<String, Object>> sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String content) {
        boolean success = notificationService.sendEmail(to, subject, content);
        return ResponseEntity.ok(Map.of("success", success));
    }

    /**
     * 获取用户通知列表
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getNotifications(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // TODO: 从数据库获取通知列表
        return ResponseEntity.ok(Map.of(
                "items", java.util.List.of(),
                "unreadCount", 0,
                "total", 0
        ));
    }

    /**
     * 标记通知已读
     */
    @PostMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Long id) {
        // TODO: 更新数据库
        return ResponseEntity.ok(Map.of("success", true));
    }
}
