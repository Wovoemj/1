package com.travel.controller;

import com.travel.dto.*;
import com.travel.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 产品服务控制器
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * 搜索产品
     */
    @GetMapping("/search")
    public ApiResponse<PageResult<ProductDTO>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(productService.search(keyword, type, city, minPrice, maxPrice, sortBy, page, size));
    }

    /**
     * 获取产品详情
     */
    @GetMapping("/{id}")
    public ApiResponse<ProductDTO> getById(@PathVariable Long id) {
        return ApiResponse.success(productService.getById(id));
    }

    /**
     * 按类型获取产品列表
     */
    @GetMapping("/type/{type}")
    public ApiResponse<PageResult<ProductDTO>> getByType(
            @PathVariable String type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(productService.getByType(type, page, size));
    }

    /**
     * 获取热门产品
     */
    @GetMapping("/trending")
    public ApiResponse<java.util.List<ProductDTO>> getTrending(
            @RequestParam(required = false) String city) {
        return ApiResponse.success(productService.getTrending(city));
    }
}
