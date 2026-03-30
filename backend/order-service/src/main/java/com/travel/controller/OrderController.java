package com.travel.controller;

import com.travel.dto.*;
import com.travel.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

/**
 * 订单服务控制器
 */
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * 创建订单
     */
    @PostMapping("/create")
    public ApiResponse<OrderDTO> createOrder(
            @RequestAttribute("userId") Long userId,
            @Valid @RequestBody CreateOrderRequest request) {
        return ApiResponse.success(orderService.createOrder(userId, request));
    }

    /**
     * 获取订单列表
     */
    @GetMapping("/list")
    public ApiResponse<PageResult<OrderDTO>> listOrders(
            @RequestAttribute("userId") Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(orderService.listOrders(userId, page, size));
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/{orderNo}")
    public ApiResponse<OrderDTO> getOrder(
            @RequestAttribute("userId") Long userId,
            @PathVariable String orderNo) {
        return ApiResponse.success(orderService.getOrder(userId, orderNo));
    }

    /**
     * 取消订单
     */
    @PostMapping("/{orderNo}/cancel")
    public ApiResponse<Void> cancelOrder(
            @RequestAttribute("userId") Long userId,
            @PathVariable String orderNo,
            @RequestBody(required = false) CancelOrderRequest request) {
        orderService.cancelOrder(userId, orderNo, request != null ? request.getReason() : null);
        return ApiResponse.ok();
    }

    /**
     * 支付回调
     */
    @PostMapping("/payment/callback")
    public ApiResponse<String> paymentCallback(@RequestBody PaymentCallbackRequest request) {
        orderService.handlePaymentCallback(request);
        return ApiResponse.success("success");
    }
}
