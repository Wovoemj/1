/**
 * TravelAI - 全局类型定义
 * 涵盖用户端、管理端、AI服务的完整数据模型
 */

// ==================== 用户系统 ====================
export interface User {
  id: number;
  uuid: string;
  phone?: string;
  email?: string;
  nickname: string;
  avatar_url?: string;
  gender: 0 | 1 | 2; // 0:未知 1:男 2:女
  birthday?: string;
  membership_level: 0 | 1 | 2 | 3; // 0:普通 1:银卡 2:金卡 3:铂金
  points: number;
  preferences: UserPreferences;
  travel_style?: TravelStyle;
  status: 0 | 1;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  destinations?: string[]; // 偏好目的地类型：海边/古镇/山岳/城市
  budget_range?: 'budget' | 'mid' | 'luxury';
  travel_pace?: 'relaxed' | 'moderate' | 'intensive';
  dietary_restrictions?: string[];
  accessibility_needs?: string[];
  language?: string;
}

export type TravelStyle = '休闲度假' | '深度体验' | '冒险探索' | '文化历史' | '美食之旅' | '摄影之旅';

export interface UserAddress {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  is_default: boolean;
}

// ==================== 目的地与POI ====================
export interface Destination {
  id: number;
  name: string;
  name_en?: string;
  country: string;
  province?: string;
  city?: string;
  description: string;
  cover_image?: string;
  images: string[];
  location?: GeoLocation;
  best_season?: string;
  avg_cost?: number;
  rating: number;
  review_count: number;
  tags: DestinationTag[];
  climate_info: ClimateInfo;
  traffic_info: TrafficInfo;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface ClimateInfo {
  avg_temp?: number;
  rainy_season?: string;
  best_months?: number[];
  description?: string;
}

export interface TrafficInfo {
  airports?: string[];
  train_stations?: string[];
  bus_terminals?: string[];
  local_transport?: string;
}

export type DestinationTag =
  | '海边' | '古镇' | '山岳' | '城市' | '沙漠' | '草原'
  | '冰雪' | '温泉' | '海岛' | '乡村' | '主题乐园' | '世界遗产';

export interface POI {
  id: number;
  destination_id: number;
  name: string;
  type: POIType;
  subtype?: string;
  description: string;
  cover_image?: string;
  images: string[];
  location?: GeoLocation;
  address?: string;
  phone?: string;
  opening_hours: OpeningHours;
  avg_cost?: number;
  rating: number;
  review_count: number;
  ticket_price?: number;
  tags: string[];
  metadata: Record<string, unknown>;
  status: 0 | 1;
}

export type POIType = 'scenic' | 'restaurant' | 'hotel' | 'shopping' | 'transport' | 'entertainment';

export interface OpeningHours {
  monday?: TimeRange;
  tuesday?: TimeRange;
  wednesday?: TimeRange;
  thursday?: TimeRange;
  friday?: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
}

export interface TimeRange {
  open: string; // HH:mm
  close: string;
  closed?: boolean;
}

// ==================== 产品系统 ====================
export interface Product {
  id: number;
  type: ProductType;
  name: string;
  description: string;
  cover_image?: string;
  images: string[];
  destination_id?: number;
  poi_id?: number;
  base_price: number;
  sale_price?: number;
  currency: string;
  inventory: number;
  sold_count: number;
  rating: number;
  review_count: number;
  tags: string[];
  metadata: ProductMetadata;
  vendor_id?: number;
  vendor_name?: string;
  status: 0 | 1;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductType = 'flight' | 'hotel' | 'ticket' | 'experience';

export type ProductMetadata = FlightMetadata | HotelMetadata | TicketMetadata | ExperienceMetadata;

export interface FlightMetadata {
  airline: string;
  flight_no: string;
  departure_city: string;
  arrival_city: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  cabin_class: 'economy' | 'business' | 'first';
  tax?: number;
}

export interface HotelMetadata {
  star_rating: number;
  room_types: HotelRoom[];
  amenities: string[];
  check_in_time: string;
  check_out_time: string;
  address: string;
}

export interface HotelRoom {
  id: number;
  room_type: string;
  bed_info: string;
  area: number; // ㎡
  floor: string;
  capacity: number;
  amenities: string[];
  price: number;
  inventory: number;
  images: string[];
}

export interface TicketMetadata {
  poi_id: number;
  ticket_type: string; // 'full' | 'half' | 'student' | 'child'
  validity_period: string;
  booking_notice: string;
  refund_policy: string;
}

export interface ExperienceMetadata {
  duration: string;
  group_size: number;
  includes: string[];
  excludes: string[];
  meeting_point: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

// ==================== 行程系统 ====================
export interface Itinerary {
  id: number;
  user_id: number;
  title: string;
  destination_id?: number;
  destination?: Destination;
  start_date: string;
  end_date: string;
  days: number;
  days_detail: DayPlan[];
  budget?: number;
  actual_cost?: number;
  travelers: number;
  tags: string[];
  cover_image?: string;
  is_ai_generated: boolean;
  is_public: boolean;
  like_count: number;
  view_count: number;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  meals: MealPlan;
  accommodation?: string;
  transport_notes?: string;
  daily_budget: number;
  weather?: WeatherInfo;
}

export interface Activity {
  time: string; // HH:mm
  activity: string;
  location: string;
  duration: string;
  cost: number;
  tips?: string;
  type: ActivityType;
  poi_id?: number;
  booking_required?: boolean;
}

export type ActivityType = 'scenic' | 'meal' | 'transport' | 'accommodation' | 'shopping' | 'entertainment' | 'rest';

export interface MealPlan {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string[];
}

export interface WeatherInfo {
  temp_high: number;
  temp_low: number;
  condition: string;
  icon: string;
}

// ==================== 订单系统 ====================
export interface Order {
  id: number;
  order_no: string;
  user_id: number;
  product_id: number;
  product_type: ProductType;
  product_name: string;
  product_snapshot: Product;
  quantity: number;
  unit_price: number;
  total_amount: number;
  discount_amount: number;
  pay_amount: number;
  contact_name?: string;
  contact_phone?: string;
  use_date?: string;
  remark?: string;
  status: OrderStatus;
  payment_method?: PaymentMethod;
  payment_time?: string;
  cancel_reason?: string;
  cancel_time?: string;
  refund_amount?: number;
  refund_time?: string;
  expire_time?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 0 // 待支付
  | 1 // 已支付
  | 2 // 已取消
  | 3 // 退款中
  | 4 // 已退款
  | 5; // 已完成

export type PaymentMethod = 'alipay' | 'wechat' | 'card' | 'balance';

export interface PaymentRecord {
  id: number;
  order_id: number;
  transaction_no: string;
  payment_method: PaymentMethod;
  amount: number;
  status: 0 | 1 | 2; // 处理中/成功/失败
  third_party_no?: string;
  created_at: string;
}

// ==================== 攻略与内容 ====================
export interface TravelGuide {
  id: number;
  author_id: number;
  author?: User;
  destination_id?: number;
  destination?: Destination;
  title: string;
  content: string;
  cover_image?: string;
  images: string[];
  tags: string[];
  view_count: number;
  like_count: number;
  bookmark_count: number;
  comment_count: number;
  is_featured: boolean;
  is_ai_generated: boolean;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface TravelNote {
  id: number;
  author_id: number;
  author?: User;
  title: string;
  content: string;
  cover_image?: string;
  images: string[];
  itinerary_id?: number;
  destination_ids: number[];
  travel_date?: string;
  days?: number;
  cost?: number;
  travelers?: number;
  tags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  status: 0 | 1;
  created_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  user?: User;
  target_type: ReviewTargetType;
  target_id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  images: string[];
  order_id?: number;
  like_count: number;
  status: 0 | 1;
  created_at: string;
}

export type ReviewTargetType = 'product' | 'poi' | 'guide' | 'note' | 'itinerary';

// ==================== AI对话系统 ====================
export interface AIConversation {
  id: number;
  user_id?: number;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: AIIntent;
  tools_used: ToolCall[];
  token_count: number;
  created_at: string;
}

export type AIIntent =
  | 'greeting'
  | 'destination_inquiry'
  | 'itinerary_planning'
  | 'booking_inquiry'
  | 'price_inquiry'
  | 'weather_inquiry'
  | 'food_recommendation'
  | 'transport_inquiry'
  | 'complaint'
  | 'feedback'
  | 'general';

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  result?: string;
}

export interface AIRecommendation {
  id: number;
  user_id: number;
  recommendation_type: string;
  input_context: Record<string, unknown>;
  recommended_items: RecommendationItem[];
  feedback?: 1 | -1;
  created_at: string;
}

export interface RecommendationItem {
  id: number;
  type: string;
  name: string;
  score: number;
  reason: string;
}

// ==================== 优惠券系统 ====================
export interface Coupon {
  id: number;
  name: string;
  type: 'full_reduction' | 'discount' | 'free_shipping';
  discount_type: 'amount' | 'percent';
  discount_value: number;
  min_amount: number;
  applicable_types: ProductType[];
  total_count: number;
  used_count: number;
  start_time: string;
  end_time: string;
  status: 0 | 1;
}

export interface UserCoupon {
  id: number;
  user_id: number;
  coupon_id: number;
  coupon?: Coupon;
  is_used: boolean;
  used_order_id?: number;
  used_time?: string;
  created_at: string;
}

// ==================== 通知系统 ====================
export interface Notification {
  id: number;
  user_id: number;
  type: 'order' | 'pay' | 'system' | 'promotion';
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

// ==================== 通用类型 ====================
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface SearchParams {
  keyword?: string;
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams extends SearchParams {
  type?: string;
  tags?: string[];
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  destination_id?: number;
}

// ==================== 管理端类型 ====================
export interface DashboardStats {
  today_orders: number;
  today_revenue: number;
  active_users: number;
  ai_conversations: number;
  order_change: number;
  revenue_change: number;
  user_change: number;
  ai_change: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

// ==================== 表单类型 ====================
export interface LoginFormData {
  phone: string;
  code: string;
}

export interface RegisterFormData {
  phone: string;
  code: string;
  nickname: string;
  password?: string;
}

export interface ItineraryFormData {
  destination: string;
  start_date: string;
  days: number;
  travelers: number;
  budget: number;
  preferences: string[];
  travel_style: TravelStyle;
}

export interface BookingFormData {
  product_id: number;
  quantity: number;
  use_date: string;
  contact_name: string;
  contact_phone: string;
  remark?: string;
  coupon_id?: number;
}
