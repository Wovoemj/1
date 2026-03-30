package com.travel.payment.controller;

import com.travel.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 创建支付
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createPayment(
            @RequestParam Long orderId,
            @RequestParam BigDecimal amount,
            @RequestParam String method) {
        return ResponseEntity.ok(paymentService.createPayment(orderId, amount, method));
    }

    /**
     * 查询支付状态
     */
    @GetMapping("/status/{transactionNo}")
    public ResponseEntity<Map<String, Object>> queryPayment(@PathVariable String transactionNo) {
        return ResponseEntity.ok(paymentService.queryPayment(transactionNo));
    }

    /**
     * 支付宝回调
     */
    @PostMapping("/callback/alipay")
    public String alipayCallback(@RequestParam Map<String, String> params) {
        boolean success = paymentService.handleCallback("alipay", params);
        return success ? "success" : "fail";
    }

    /**
     * 微信支付回调
     */
    @PostMapping("/callback/wechat")
    public String wechatCallback(@RequestBody String xmlData) {
        boolean success = paymentService.handleCallback("wechat", Map.of("data", xmlData));
        return success ? "<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>" : "<xml><return_code><![CDATA[FAIL]]></return_code></xml>";
    }

    /**
     * 退款
     */
    @PostMapping("/refund")
    public ResponseEntity<Map<String, Object>> refund(
            @RequestParam String transactionNo,
            @RequestParam BigDecimal amount,
            @RequestParam String reason) {
        return ResponseEntity.ok(paymentService.refund(transactionNo, amount, reason));
    }
}
