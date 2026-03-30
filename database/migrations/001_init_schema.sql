# 智能旅游助手 - 数据库完整迁移脚本
-- PostgreSQL 16

-- ==================== 扩展 ====================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- 模糊搜索
CREATE EXTENSION IF NOT EXISTS "postgis";       -- 地理位置

-- ==================== 用户系统 ====================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    nickname VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(500),
    gender TINYINT DEFAULT 0,               -- 0:未知 1:男 2:女
    birthday DATE,
    membership_level INT DEFAULT 0,          -- 0:普通 1:银卡 2:金卡 3:铂金
    points INT DEFAULT 0,
    preferences JSONB DEFAULT '{}',
    travel_style VARCHAR(50),                -- 深度体验/休闲度假/冒险探索/文化历史
    status SMALLINT DEFAULT 1,               -- 0:禁用 1:正常
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_membership ON users(membership_level);

-- 用户地址簿
CREATE TABLE user_addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    name VARCHAR(50),
    phone VARCHAR(20),
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    address VARCHAR(200),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== 目的地与POI ====================
CREATE TABLE destinations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    country VARCHAR(50) DEFAULT '中国',
    province VARCHAR(50),
    city VARCHAR(50),
    description TEXT,
    cover_image VARCHAR(500),
    images JSONB DEFAULT '[]',
    location GEOGRAPHY(POINT, 4326),          -- PostGIS 地理位置
    best_season VARCHAR(50),                  -- 最佳旅游季节
    avg_cost DECIMAL(10,2),                   -- 平均花费
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    tags JSONB DEFAULT '[]',                  -- 海边/古镇/山岳/城市等
    climate_info JSONB DEFAULT '{}',
    traffic_info JSONB DEFAULT '{}',
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_destinations_name ON destinations USING gin(name gin_trgm_ops);
CREATE INDEX idx_destinations_location ON destinations USING gist(location);
CREATE INDEX idx_destinations_tags ON destinations USING gin(tags);

-- POI（兴趣点）
CREATE TABLE pois (
    id BIGSERIAL PRIMARY KEY,
    destination_id BIGINT REFERENCES destinations(id),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,               -- scenic/restaurant/hotel/shopping/transport
    subtype VARCHAR(50),
    description TEXT,
    cover_image VARCHAR(500),
    images JSONB DEFAULT '[]',
    location GEOGRAPHY(POINT, 4326),
    address VARCHAR(500),
    phone VARCHAR(50),
    opening_hours JSONB DEFAULT '{}',
    avg_cost DECIMAL(10,2),
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    ticket_price DECIMAL(10,2),
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pois_destination ON pois(destination_id);
CREATE INDEX idx_pois_type ON pois(type);
CREATE INDEX idx_pois_location ON pois USING gist(location);
CREATE INDEX idx_pois_name ON pois USING gin(name gin_trgm_ops);

-- ==================== 产品系统 ====================
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,               -- flight/hotel/ticket/experience
    name VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    images JSONB DEFAULT '[]',
    destination_id BIGINT REFERENCES destinations(id),
    poi_id BIGINT REFERENCES pois(id),
    base_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'CNY',
    inventory INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',             -- 类型特定字段
    vendor_id BIGINT,
    vendor_name VARCHAR(100),
    status SMALLINT DEFAULT 1,               -- 0:下架 1:上架
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_destination ON products(destination_id);
CREATE INDEX idx_products_price ON products(sale_price);
CREATE INDEX idx_products_tags ON products USING gin(tags);

-- 酒店房型
CREATE TABLE hotel_rooms (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    room_type VARCHAR(100),                  -- 大床房/双床房/套房
    bed_info VARCHAR(100),
    area DECIMAL(6,2),                       -- 面积㎡
    floor VARCHAR(20),
    capacity INT DEFAULT 2,
    amenities JSONB DEFAULT '[]',            -- 设施
    price DECIMAL(10,2),
    inventory INT DEFAULT 0,
    images JSONB DEFAULT '[]',
    status SMALLINT DEFAULT 1
);

-- 航班信息
CREATE TABLE flights (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id),
    airline VARCHAR(50),
    flight_no VARCHAR(20),
    departure_city VARCHAR(50),
    arrival_city VARCHAR(50),
    departure_airport VARCHAR(100),
    arrival_airport VARCHAR(100),
    departure_time TIMESTAMP,
    arrival_time TIMESTAMP,
    duration_minutes INT,
    cabin_class VARCHAR(20),                 -- economy/business/first
    price DECIMAL(10,2),
    tax DECIMAL(10,2),
    inventory INT DEFAULT 0,
    status SMALLINT DEFAULT 1
);

CREATE INDEX idx_flights_route ON flights(departure_city, arrival_city);
CREATE INDEX idx_flights_time ON flights(departure_time);

-- ==================== 行程系统 ====================
CREATE TABLE itineraries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    destination_id BIGINT REFERENCES destinations(id),
    start_date DATE,
    end_date DATE,
    days INT,
    days_detail JSONB NOT NULL DEFAULT '[]',
    -- [{"day":1,"date":"2024-01-01","items":[{"time":"09:00","poi_id":1,"activity":"参观故宫","duration":"3h"}]}]
    budget DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    travelers INT DEFAULT 1,
    tags JSONB DEFAULT '[]',
    cover_image VARCHAR(500),
    is_ai_generated BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_itineraries_user ON itineraries(user_id);
CREATE INDEX idx_itineraries_destination ON itineraries(destination_id);
CREATE INDEX idx_itineraries_public ON itineraries(is_public, like_count DESC);

-- ==================== 订单系统 ====================
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_no VARCHAR(32) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id),
    product_id BIGINT REFERENCES products(id),
    product_type VARCHAR(20),
    product_name VARCHAR(200),
    product_snapshot JSONB,                  -- 下单时产品快照
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    pay_amount DECIMAL(10,2),
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    use_date DATE,
    remark TEXT,
    status SMALLINT DEFAULT 0,               -- 0:待支付 1:已支付 2:已取消 3:退款中 4:已退款 5:已完成
    payment_method VARCHAR(20),
    payment_time TIMESTAMP,
    cancel_reason VARCHAR(200),
    cancel_time TIMESTAMP,
    refund_amount DECIMAL(10,2),
    refund_time TIMESTAMP,
    expire_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_no ON orders(order_no);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- 支付流水
CREATE TABLE payment_records (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    transaction_no VARCHAR(64) UNIQUE,
    payment_method VARCHAR(20),              -- alipay/wechat/card
    amount DECIMAL(10,2),
    status SMALLINT DEFAULT 0,               -- 0:处理中 1:成功 2:失败
    third_party_no VARCHAR(64),
    callback_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== 攻略与内容 ====================
CREATE TABLE travel_guides (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT REFERENCES users(id),
    destination_id BIGINT REFERENCES destinations(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    images JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    bookmark_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guides_destination ON travel_guides(destination_id);
CREATE INDEX idx_guides_author ON travel_guides(author_id);
CREATE INDEX idx_guides_featured ON travel_guides(is_featured, like_count DESC);

-- 游记
CREATE TABLE travel_notes (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    images JSONB DEFAULT '[]',
    itinerary_id BIGINT REFERENCES itineraries(id),
    destination_ids JSONB DEFAULT '[]',
    travel_date DATE,
    days INT,
    cost DECIMAL(10,2),
    travelers INT,
    tags JSONB DEFAULT '[]',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 评论
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    target_type VARCHAR(20) NOT NULL,        -- product/poi/guide/note
    target_id BIGINT NOT NULL,
    rating SMALLINT NOT NULL CHECK(rating BETWEEN 1 AND 5),
    content TEXT,
    images JSONB DEFAULT '[]',
    order_id BIGINT,
    like_count INT DEFAULT 0,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ==================== AI对话系统 ====================
CREATE TABLE ai_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    session_id VARCHAR(64) NOT NULL,
    role VARCHAR(20) NOT NULL,               -- user/assistant/system
    content TEXT NOT NULL,
    intent VARCHAR(50),                      -- 意图识别结果
    tools_used JSONB DEFAULT '[]',           -- 使用的工具
    token_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_conv_session ON ai_conversations(session_id);
CREATE INDEX idx_ai_conv_user ON ai_conversations(user_id);

-- AI推荐日志
CREATE TABLE ai_recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    recommendation_type VARCHAR(50),
    input_context JSONB,
    recommended_items JSONB,
    feedback SMALLINT,                       -- 1:喜欢 -1:不喜欢
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== 收藏与足迹 ====================
CREATE TABLE user_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    target_type VARCHAR(20) NOT NULL,
    target_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE user_footprints (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    target_type VARCHAR(20) NOT NULL,
    target_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_footprints_user ON user_footprints(user_id, created_at DESC);

-- ==================== 优惠券系统 ====================
CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(20),                        -- full_reduction/discount/free_shipping
    discount_type VARCHAR(20),               -- amount/percent
    discount_value DECIMAL(10,2),
    min_amount DECIMAL(10,2),
    applicable_types JSONB DEFAULT '[]',
    total_count INT,
    used_count INT DEFAULT 0,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_coupons (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    coupon_id BIGINT REFERENCES coupons(id),
    is_used BOOLEAN DEFAULT FALSE,
    used_order_id BIGINT,
    used_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== 通知系统 ====================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    type VARCHAR(30),                        -- order/pay/system/promotion
    title VARCHAR(200),
    content TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ==================== 触发器：自动更新 updated_at ====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_destinations_updated BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_pois_updated BEFORE UPDATE ON pois FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_itineraries_updated BEFORE UPDATE ON itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_guides_updated BEFORE UPDATE ON travel_guides FOR EACH ROW EXECUTE FUNCTION update_updated_at();
