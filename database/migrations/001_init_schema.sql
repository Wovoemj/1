-- ============================================
-- 智能旅游助手 - 核心数据库Schema
-- 数据库: PostgreSQL 15+
-- ============================================

-- 启用扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- 用户表
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    nickname VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(500),
    gender TINYINT DEFAULT 0, -- 0:未知 1:男 2:女
    birthday DATE,
    membership_level TINYINT DEFAULT 0, -- 0:普通 1:白银 2:黄金 3:铂金 4:钻石
    points INT DEFAULT 0,
    preferences JSONB DEFAULT '{}',
    status TINYINT DEFAULT 1, -- 0:禁用 1:正常
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- ============================================
-- 产品表（多态设计）
-- ============================================
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('flight', 'hotel', 'ticket', 'experience')),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_desc VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'CNY',
    inventory INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}', -- 类型特定字段
    images JSONB DEFAULT '[]',
    location GEOGRAPHY(POINT, 4326),
    address VARCHAR(500),
    city VARCHAR(50),
    country VARCHAR(50) DEFAULT '中国',
    status TINYINT DEFAULT 1, -- 0:下架 1:上架
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_city ON products(city);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_location ON products USING GIST(location);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- ============================================
-- 行程表
-- ============================================
CREATE TABLE itineraries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    destination VARCHAR(100),
    start_date DATE,
    end_date DATE,
    days INT,
    days_detail JSONB NOT NULL DEFAULT '[]', -- 每日行程安排
    budget DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    tags JSONB DEFAULT '[]',
    style VARCHAR(50),
    cover_image VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_itineraries_user ON itineraries(user_id);
CREATE INDEX idx_itineraries_public ON itineraries(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_itineraries_tags ON itineraries USING GIN(tags);

-- ============================================
-- 订单表
-- ============================================
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_no VARCHAR(32) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    pay_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'completed', 'refunding', 'refunded')),
    payment_method VARCHAR(20),
    payment_time TIMESTAMP,
    cancel_reason VARCHAR(200),
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    travel_date DATE,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_no ON orders(order_no);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- AI对话历史表
-- ============================================
CREATE TABLE ai_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    session_id VARCHAR(64) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    intent VARCHAR(50),
    tokens_used INT DEFAULT 0,
    model VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_conv_session ON ai_conversations(session_id);
CREATE INDEX idx_ai_conv_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conv_created ON ai_conversations(created_at);

-- ============================================
-- 收藏表
-- ============================================
CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('product', 'itinerary', 'guide')),
    target_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);

-- ============================================
-- 评价表
-- ============================================
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    order_id BIGINT REFERENCES orders(id),
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT,
    images JSONB DEFAULT '[]',
    reply TEXT,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ============================================
-- 攻略/内容表
-- ============================================
CREATE TABLE guides (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    destination VARCHAR(100),
    category VARCHAR(50),
    cover_image VARCHAR(500),
    images JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guides_author ON guides(author_id);
CREATE INDEX idx_guides_dest ON guides(destination);
CREATE INDEX idx_guides_category ON guides(category);
CREATE INDEX idx_guides_featured ON guides(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_guides_tags ON guides USING GIN(tags);

-- ============================================
-- 推荐记录表
-- ============================================
CREATE TABLE recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    score DECIMAL(5,4),
    reason VARCHAR(200),
    source VARCHAR(50), -- collaborative, content, vector, trending
    is_clicked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rec_user ON recommendations(user_id);
CREATE INDEX idx_rec_score ON recommendations(score DESC);

-- ============================================
-- 通知表
-- ============================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
