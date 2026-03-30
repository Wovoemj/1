package com.travel.order.controller;

import com.travel.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Object> req) {
        Long productId = Long.valueOf(req.get("productId").toString());
        int quantity = Integer.parseInt(req.get("quantity").toString());
        BigDecimal unitPrice = new BigDecimal(req.get("unitPrice").toString());
        String useDate = (String) req.get("useDate");
        String remark = (String) req.get("remark");

        return ResponseEntity.ok(orderService.createOrder(userId, productId, quantity, unitPrice, useDate, remark));
    }

    @PostMapping("/{orderNo}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(
            @PathVariable String orderNo,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, String> req) {
        return ResponseEntity.ok(orderService.cancelOrder(orderNo, userId, req.get("reason")));
    }

    @GetMapping("/{orderNo}")
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable String orderNo) {
        return ResponseEntity.ok(orderService.getOrder(orderNo));
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getUserOrders(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getUserOrders(userId, status, page, size));
    }
}
