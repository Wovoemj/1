package com.travel.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

/**
 * API 网关服务 - 统一入口
 * 职责：路由转发、限流熔断、认证鉴权、日志记录
 */
@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f.stripPrefix(1)
                                .addRequestHeader("X-Gateway", "travel-ai")
                                .circuitBreaker(c -> c.setName("userCircuit")
                                        .setFallbackUri("forward:/fallback")))
                        .uri("lb://user-service"))

                .route("product-service", r -> r.path("/api/products/**", "/api/destinations/**", "/api/pois/**")
                        .filters(f -> f.stripPrefix(1)
                                .requestRateLimiter(c -> c.setRateLimiter(redisRateLimiter()))
                                .circuitBreaker(c -> c.setName("productCircuit")
                                        .setFallbackUri("forward:/fallback")))
                        .uri("lb://product-service"))

                .route("order-service", r -> r.path("/api/orders/**")
                        .filters(f -> f.stripPrefix(1)
                                .circuitBreaker(c -> c.setName("orderCircuit")
                                        .setFallbackUri("forward:/fallback")))
                        .uri("lb://order-service"))

                .route("payment-service", r -> r.path("/api/payments/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://payment-service"))

                .route("ai-service", r -> r.path("/api/ai/**")
                        .filters(f -> f.stripPrefix(1)
                                .requestRateLimiter(c -> c.setRateLimiter(redisRateLimiter())))
                        .uri("lb://ai-service"))

                .route("recommend-service", r -> r.path("/api/recommend/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://recommend-service"))

                .route("notification-service", r -> r.path("/api/notifications/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://notification-service"))

                .build();
    }

    @Bean
    public RedisRateLimiter redisRateLimiter() {
        // 令牌桶限流：每秒100个请求，突发200
        return new RedisRateLimiter(100, 200);
    }
}
