package com.travel.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.Map;

/**
 * API统一响应
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;
    private long timestamp;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data, System.currentTimeMillis());
    }

    public static <T> ApiResponse<T> ok() {
        return new ApiResponse<>(200, "success", null, System.currentTimeMillis());
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null, System.currentTimeMillis());
    }
}

@Data
class LoginRequest {
    @NotBlank(message = "手机号不能为空")
    private String phone;
    @NotBlank(message = "验证码不能为空")
    private String code;
}

@Data
@AllArgsConstructor
class LoginResponse {
    private String token;
    private UserDTO user;
}

@Data
class SendCodeRequest {
    @NotBlank(message = "手机号不能为空")
    private String phone;
}

@Data
class UpdateUserRequest {
    private String nickname;
    private String avatarUrl;
    private Integer gender;
    private LocalDate birthday;
    private Map<String, Object> preferences;
}

@Data
class UserDTO {
    private Long id;
    private String phone;
    private String email;
    private String nickname;
    private String avatarUrl;
    private Integer membershipLevel;
    private Integer points;

    public static UserDTO from(com.travel.model.User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setPhone(user.getPhone());
        dto.setEmail(user.getEmail());
        dto.setNickname(user.getNickname());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setMembershipLevel(user.getMembershipLevel());
        dto.setPoints(user.getPoints());
        return dto;
    }
}
