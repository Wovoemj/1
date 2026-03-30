package com.travel.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 全局认证过滤器
 */
@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    // 白名单路径（无需认证）
    private static final List<String> WHITE_LIST = List.of(
            "/api/users/login",
            "/api/users/register",
            "/api/products/public",
            "/api/destinations/public",
            "/api/ai/public",
            "/actuator"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // 添加请求追踪ID
        String traceId = UUID.randomUUID().toString().replace("-", "");
        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-Trace-Id", traceId)
                .build();

        // 白名单放行
        if (isWhiteListed(path)) {
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        }

        // JWT Token 验证
        String token = request.getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        try {
            String jwt = token.substring(7);
            // TODO: JWT 解析与验证
            // Claims claims = JwtUtil.parseToken(jwt);
            // String userId = claims.getSubject();

            // 将用户信息传递给下游服务
            ServerHttpRequest finalRequest = mutatedRequest.mutate()
                    .header("X-User-Id", "1")  // TODO: 从JWT获取
                    .header("X-User-Role", "user")
                    .build();

            return chain.filter(exchange.mutate().request(finalRequest).build());
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    private boolean isWhiteListed(String path) {
        return WHITE_LIST.stream().anyMatch(path::startsWith);
    }

    @Override
    public int getOrder() {
        return -100; // 最高优先级
    }
}
