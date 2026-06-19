package com.application.stats.component;
import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class GlobalRateLimiter implements Filter {

    private final RateLimiterRegistry rateLimiterRegistry;

    public GlobalRateLimiter(RateLimiterRegistry rateLimiterRegistry) {
        this.rateLimiterRegistry = rateLimiterRegistry;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String ip = httpRequest.getRemoteAddr();

        RateLimiter limiter = rateLimiterRegistry.rateLimiter(ip);

        if (limiter.acquirePermission()) {
            chain.doFilter(request, response);
        } else {
            httpResponse.setStatus(429); //Too Many Requests
            httpResponse.setContentType("application/json");
            httpResponse.setCharacterEncoding("UTF-8");
            httpResponse.getWriter().write("{ \"error\": \"Too Many Requests\" }");
        }
    }
}