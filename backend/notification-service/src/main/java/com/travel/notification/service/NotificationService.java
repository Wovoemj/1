package com.travel.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 通知服务 - 短信/邮件/推送
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    /**
     * 发送短信验证码
     */
    public boolean sendSmsCode(String phone, String code) {
        log.info("发送短信验证码: phone={}, code=***");
        // TODO: 调用阿里云/腾讯云短信API
        // 示例: AliyunSmsUtil.send(phone, SMS_TEMPLATE_CODE, Map.of("code", code));
        return true;
    }

    /**
     * 发送订单通知
     */
    public void sendOrderNotification(Long userId, String orderNo, String status) {
        String title = switch (status) {
            case "PAID" -> "支付成功";
            case "CANCELLED" -> "订单已取消";
            case "REFUNDED" -> "退款成功";
            case "COMPLETED" -> "订单已完成";
            default -> "订单状态更新";
        };

        String content = String.format("您的订单 %s 状态已更新为: %s", orderNo, status);

        // 发送站内信
        saveInAppNotification(userId, title, content, "/orders/" + orderNo);

        // 发送推送通知
        sendPushNotification(userId, title, content);

        log.info("订单通知已发送: userId={}, orderNo={}, status={}", userId, orderNo, status);
    }

    /**
     * 发送行程提醒
     */
    public void sendItineraryReminder(Long userId, String tripTitle, LocalDateTime tripDate) {
        String title = "行程提醒";
        String content = String.format("您的「%s」行程将于 %s 开始，请做好准备！",
                tripTitle, tripDate.toString());

        saveInAppNotification(userId, title, content, "/itinerary");
        sendPushNotification(userId, title, content);
    }

    /**
     * 发送优惠活动通知
     */
    public void sendPromotionNotification(Long userId, String title, String content) {
        saveInAppNotification(userId, title, content, "/promotions");
        sendPushNotification(userId, title, content);
    }

    /**
     * 保存站内信
     */
    private void saveInAppNotification(Long userId, String title, String content, String link) {
        log.info("保存站内信: userId={}, title={}", userId, title);
        // TODO: 存入数据库 notifications 表
    }

    /**
     * 发送推送通知
     */
    private void sendPushNotification(Long userId, String title, String content) {
        log.info("发送推送通知: userId={}, title={}", userId, title);
        // TODO: 调用极光推送/个推等
    }

    /**
     * 发送邮件
     */
    public boolean sendEmail(String to, String subject, String htmlContent) {
        log.info("发送邮件: to={}, subject={}", to, subject);
        // TODO: 使用 Spring Mail / SendGrid 发送邮件
        return true;
    }
}
