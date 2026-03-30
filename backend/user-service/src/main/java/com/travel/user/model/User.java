package com.travel.user.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 用户实体
 */
@Data
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String uuid;
    private String phone;
    private String email;
    private String passwordHash;
    private String nickname;
    private String avatarUrl;
    private Integer gender;
    private LocalDate birthday;
    private Integer membershipLevel;
    private Integer points;
    private String travelStyle;
    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
