-- 种子数据 - 测试用

-- 目的地数据
INSERT INTO destinations (name, name_en, country, province, description, best_season, avg_cost, rating, tags, climate_info) VALUES
('三亚', 'Sanya', '中国', '海南', '中国最南端的热带滨海旅游城市，拥有绝美的海滩和丰富的海洋资源', '10月-次年4月', 3500.00, 4.7, '["海边","度假","热带","潜水"]', '{"avg_temp":"25°C","rainfall":"较少"}'),
('丽江', 'Lijiang', '中国', '云南', '世界文化遗产古城，纳西族文化与玉龙雪山的完美结合', '3月-5月,9月-11月', 2800.00, 4.6, '["古镇","雪山","文化","文艺"]', '{"avg_temp":"13°C","rainfall":"适中"}'),
('北京', 'Beijing', '中国', '北京', '中国首都，千年古都，历史文化与现代都市的交汇', '9月-10月', 4000.00, 4.8, '["历史","文化","博物馆","美食"]', '{"avg_temp":"13°C","rainfall":"较少"}'),
('上海', 'Shanghai', '中国', '上海', '国际大都市，中西文化交融，现代化与历史并存', '3月-5月,9月-11月', 4500.00, 4.7, '["都市","购物","美食","夜景"]', '{"avg_temp":"16°C","rainfall":"适中"}'),
('成都', 'Chengdu', '中国', '四川', '天府之国，熊猫故乡，美食之都', '3月-6月,9月-11月', 2500.00, 4.8, '["美食","熊猫","休闲","文化"]', '{"avg_temp":"16°C","rainfall":"较多"}'),
('西安', 'Xi''an', '中国', '陕西', '十三朝古都，兵马俑世界奇迹，丝绸之路起点', '3月-5月,9月-11月', 2200.00, 4.7, '["历史","古迹","美食","文化"]', '{"avg_temp":"14°C","rainfall":"适中"}'),
('桂林', 'Guilin', '中国', '广西', '山水甲天下，喀斯特地貌的代表', '4月-10月', 2000.00, 4.6, '["山水","田园","摄影","漂流"]', '{"avg_temp":"19°C","rainfall":"较多"}'),
('厦门', 'Xiamen', '中国', '福建', '海上花园，文艺小清新之城', '3月-5月,10月-11月', 2800.00, 4.5, '["海岛","文艺","美食","鼓浪屿"]', '{"avg_temp":"21°C","rainfall":"适中"}');

-- POI 数据
INSERT INTO pois (destination_id, name, type, subtype, description, avg_cost, rating, tags) VALUES
(1, '亚龙湾', 'scenic', 'beach', '天下第一湾，海水清澈，沙质细腻', 0, 4.8, '["海滩","游泳","潜水"]'),
(1, '蜈支洲岛', 'scenic', 'island', '中国马尔代夫，潜水圣地', 168.00, 4.7, '["海岛","潜水","拍照"]'),
(1, '南山文化旅游区', 'scenic', 'cultural', '108米南海观音像', 129.00, 4.6, '["佛教","文化","祈福"]'),
(2, '丽江古城', 'scenic', 'ancient_town', '世界文化遗产，纳西风情', 50.00, 4.8, '["古城","酒吧","夜景"]'),
(2, '玉龙雪山', 'scenic', 'mountain', '纳西族神山，终年积雪', 180.00, 4.9, '["雪山","索道","蓝月谷"]'),
(3, '故宫博物院', 'scenic', 'museum', '世界上最大的宫殿建筑群', 60.00, 4.9, '["历史","皇家","建筑"]'),
(3, '长城', 'scenic', 'historical', '世界七大奇迹之一', 40.00, 4.9, '["历史","徒步","壮观"]'),
(4, '外滩', 'scenic', 'landmark', '上海地标，万国建筑博览群', 0, 4.7, '["夜景","建筑","黄浦江"]'),
(5, '成都大熊猫繁育研究基地', 'scenic', 'zoo', '近距离观赏国宝大熊猫', 55.00, 4.8, '["熊猫","亲子","科普"]'),
(6, '秦始皇兵马俑博物馆', 'scenic', 'museum', '世界第八大奇迹', 120.00, 4.9, '["历史","考古","壮观"]');

-- 管理员用户
INSERT INTO users (phone, nickname, membership_level, preferences, travel_style) VALUES
('13800000001', '管理员', 3, '{"notifications": true}', '深度体验型'),
('13800000002', '测试用户', 1, '{"destinations": ["海边", "古镇"], "budget": "mid-range"}', '休闲度假型'),
('13800000003', '旅行达人', 2, '{"destinations": ["雪山", "文化"], "budget": "luxury"}', '冒险探索型');

-- 攻略数据
INSERT INTO travel_guides (author_id, destination_id, title, content, tags, view_count, like_count, is_featured) VALUES
(2, 1, '三亚五日深度游攻略', '详细介绍了三亚的最佳游玩路线、美食推荐、住宿选择...', '["攻略","三亚","自由行"]', 12500, 890, TRUE),
(2, 2, '丽江古城+玉龙雪山完美行程', '从丽江古城出发，到玉龙雪山，再到蓝月谷...', '["攻略","丽江","雪山"]', 8900, 650, TRUE),
(3, 3, '北京七日历史文化之旅', '故宫、长城、颐和园...带你看遍千年古都', '["攻略","北京","历史"]', 15000, 1200, TRUE),
(3, 5, '成都美食地图大全', '从火锅到串串，从担担面到龙抄手...', '["攻略","成都","美食"]', 20000, 1800, TRUE);

-- 优惠券
INSERT INTO coupons (name, type, discount_type, discount_value, min_amount, applicable_types, total_count, start_time, end_time) VALUES
('新人专享', 'full_reduction', 'amount', 50.00, 200.00, '["hotel","ticket"]', 1000, NOW(), NOW() + INTERVAL '30 days'),
('酒店立减', 'full_reduction', 'amount', 100.00, 500.00, '["hotel"]', 500, NOW(), NOW() + INTERVAL '60 days'),
('机票折扣', 'discount', 'percent', 0.90, 300.00, '["flight"]', 200, NOW(), NOW() + INTERVAL '15 days');
