export interface User {
  id: number;
  uuid: string;
  phone?: string;
  email?: string;
  nickname: string;
  avatar_url?: string;
  gender: number;
  birthday?: string;
  membership_level: number;
  points: number;
  preferences: Record<string, any>;
  travel_style?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: number;
  name: string;
  name_en?: string;
  country: string;
  province?: string;
  description: string;
  cover_image?: string;
  images: string[];
  best_season?: string;
  avg_cost?: number;
  rating: number;
  review_count: number;
  tags: string[];
  climate_info: Record<string, any>;
  traffic_info: Record<string, any>;
}

export interface POI {
  id: number;
  destination_id: number;
  name: string;
  type: string;
  subtype?: string;
  description: string;
  cover_image?: string;
  images: string[];
  address?: string;
  phone?: string;
  opening_hours: Record<string, any>;
  avg_cost?: number;
  rating: number;
  review_count: number;
  ticket_price?: number;
  tags: string[];
}

export interface Product {
  id: number;
  type: 'flight' | 'hotel' | 'ticket' | 'experience';
  name: string;
  description: string;
  cover_image?: string;
  images: string[];
  destination_id?: number;
  base_price: number;
  sale_price?: number;
  inventory: number;
  sold_count: number;
  rating: number;
  review_count: number;
  tags: string[];
  metadata: Record<string, any>;
  status: number;
}

export interface Itinerary {
  id: number;
  user_id: number;
  title: string;
  destination_id?: number;
  start_date: string;
  end_date: string;
  days: number;
  days_detail: DayPlan[];
  budget?: number;
  actual_cost?: number;
  travelers: number;
  tags: string[];
  is_ai_generated: boolean;
  is_public: boolean;
  like_count: number;
  view_count: number;
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  daily_budget: number;
}

export interface Activity {
  time: string;
  activity: string;
  location: string;
  duration: string;
  cost: number;
  tips?: string;
  type: 'scenic' | 'meal' | 'transport' | 'accommodation' | 'shopping';
}

export interface Order {
  id: number;
  order_no: string;
  user_id: number;
  product_id: number;
  product_type: string;
  product_name: string;
  product_snapshot: any;
  quantity: number;
  unit_price: number;
  total_amount: number;
  discount_amount: number;
  pay_amount: number;
  contact_name?: string;
  contact_phone?: string;
  use_date?: string;
  remark?: string;
  status: number;
  payment_method?: string;
  payment_time?: string;
  created_at: string;
  updated_at: string;
}

export interface TravelGuide {
  id: number;
  author_id: number;
  destination_id?: number;
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
  status: number;
  created_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  target_type: string;
  target_id: number;
  rating: number;
  content: string;
  images: string[];
  like_count: number;
  created_at: string;
}

export interface AIConversation {
  id: number;
  user_id?: number;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: string;
  tools_used: string[];
  token_count: number;
  created_at: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
