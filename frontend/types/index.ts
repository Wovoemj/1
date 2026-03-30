// 用户相关类型
export interface User {
  id: number;
  phone: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  membershipLevel: number;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  destinationTypes: string[];
  budgetRange: 'budget' | 'mid-range' | 'luxury';
  travelStyle: string;
  dietaryRestrictions: string[];
}

// 产品相关类型
export type ProductType = 'flight' | 'hotel' | 'ticket' | 'experience';

export interface Product {
  id: number;
  type: ProductType;
  name: string;
  description: string;
  price: number;
  inventory: number;
  tags: string[];
  metadata: Record<string, any>;
  status: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  location?: GeoLocation;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
}

// 行程相关类型
export interface Itinerary {
  id: number;
  userId: number;
  title: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
  budget: number;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  notes?: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: GeoLocation;
  duration: number; // 分钟
  cost: number;
  type: 'attraction' | 'restaurant' | 'transport' | 'hotel' | 'activity';
  bookingRequired: boolean;
  productId?: number;
}

// 订单相关类型
export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'completed' | 'refunded';

export interface Order {
  id: number;
  userId: number;
  orderNo: string;
  product: Product;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  paymentTime?: string;
  createdAt: string;
}

// AI相关类型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: string;
  suggestions?: string[];
}

export interface AIConversation {
  sessionId: string;
  messages: ChatMessage[];
  context?: Record<string, any>;
}

// 搜索与推荐
export interface SearchParams {
  keyword: string;
  destination?: string;
  dateRange?: [string, string];
  priceRange?: [number, number];
  tags?: string[];
  sortBy?: 'price' | 'rating' | 'popularity';
  page?: number;
  pageSize?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// API响应
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}
