package com.travel.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.*;

/**
 * 用户实体
 */
@Data
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private java.util.UUID uuid;
    private String phone;
    private String email;
    private String passwordHash;
    private String nickname;
    private String avatarUrl;
    private Integer gender;
    private LocalDate birthday;
    private Integer membershipLevel;
    private Integer points;
    private String preferences; // JSON
    private Integer status;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
