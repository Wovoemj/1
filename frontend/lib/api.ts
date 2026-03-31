/**
 * TravelAI - API 客户端
 * 统一管理所有前后端API请求，支持认证、重试、错误处理
 */

import type {
  User, Destination, POI, Product, Itinerary, Order,
  TravelGuide, TravelNote, Review, AIConversation, Notification,
  ApiResponse, PaginatedResponse, FilterParams,
  LoginFormData, RegisterFormData, ItineraryFormData, BookingFormData,
  DashboardStats, UserPreferences
} from '@/types';

// ==================== 配置 ====================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const AI_BASE = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000/api/ai';

// ==================== 工具函数 ====================
function buildQueryString(params: Record<string, unknown>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        query.set(key, value.join(','));
      } else {
        query.set(key, String(value));
      }
    }
  });
  return query.toString();
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function setToken(token: string): void {
  localStorage.setItem('token', token);
}

function clearToken(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// ==================== 基础请求 ====================
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/user';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    return result.data ?? result as unknown as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('请求超时，请重试');
    }
    throw error;
  }
}

// ==================== 用户服务 ====================
export const userApi = {
  /** 手机号登录 */
  async login(data: LoginFormData): Promise<{ token: string; user: User }> {
    const result = await request<{ token: string; user: User }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(result.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return result;
  },

  /** 注册 */
  async register(data: RegisterFormData): Promise<{ token: string; user: User }> {
    const result = await request<{ token: string; user: User }>('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(result.token);
    return result;
  },

  /** 退出登录 */
  logout(): void {
    clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  /** 获取用户信息 */
  async getProfile(): Promise<User> {
    return request<User>('/users/profile');
  },

  /** 更新用户信息 */
  async updateProfile(data: Partial<User>): Promise<User> {
    return request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** 更新偏好设置 */
  async updatePreferences(preferences: UserPreferences): Promise<User> {
    return request<User>('/users/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  },

  /** 发送验证码 */
  async sendCode(phone: string): Promise<void> {
    return request<void>('/users/send-code', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  /** 获取收藏列表 */
  async getFavorites(params?: { type?: string; page?: number }): Promise<PaginatedResponse<any>> {
    const qs = buildQueryString({ ...params, size: 20 });
    return request<PaginatedResponse<any>>(`/users/favorites?${qs}`);
  },

  /** 添加收藏 */
  async addFavorite(targetType: string, targetId: number): Promise<void> {
    return request<void>('/users/favorites', {
      method: 'POST',
      body: JSON.stringify({ target_type: targetType, target_id: targetId }),
    });
  },

  /** 取消收藏 */
  async removeFavorite(targetType: string, targetId: number): Promise<void> {
    return request<void>(`/users/favorites/${targetType}/${targetId}`, {
      method: 'DELETE',
    });
  },

  /** 获取足迹 */
  async getFootprints(page = 0): Promise<PaginatedResponse<any>> {
    return request<PaginatedResponse<any>>(`/users/footprints?page=${page}&size=20`);
  },
};

// ==================== 目的地服务 ====================
export const destinationApi = {
  /** 获取目的地列表 */
  async getList(params?: FilterParams): Promise<PaginatedResponse<Destination>> {
    const qs = buildQueryString({ ...params, size: params?.size || 12 });
    return request<PaginatedResponse<Destination>>(`/products/public/destinations?${qs}`);
  },

  /** 获取目的地详情 */
  async getDetail(id: number): Promise<Destination> {
    return request<Destination>(`/products/public/destinations/${id}`);
  },

  /** 搜索目的地 */
  async search(keyword: string, size = 10): Promise<Destination[]> {
    return request<Destination[]>(`/products/public/destinations/search?keyword=${encodeURIComponent(keyword)}&size=${size}`);
  },

  /** 获取热门目的地 */
  async getHot(size = 10): Promise<Destination[]> {
    return request<Destination[]>(`/products/public/destinations/hot?size=${size}`);
  },
};

// ==================== POI服务 ====================
export const poiApi = {
  /** 获取POI列表 */
  async getList(destinationId: number, type?: string): Promise<POI[]> {
    const qs = type ? `?type=${type}` : '';
    return request<POI[]>(`/products/public/pois?destinationId=${destinationId}${qs}`);
  },

  /** 获取POI详情 */
  async getDetail(id: number): Promise<POI> {
    return request<POI>(`/products/public/pois/${id}`);
  },

  /** 周边搜索 */
  async nearby(lat: number, lng: number, radius = 5000, type?: string): Promise<POI[]> {
    const qs = buildQueryString({ lat, lng, radius, type });
    return request<POI[]>(`/products/public/pois/nearby?${qs}`);
  },
};

// ==================== 产品服务 ====================
export const productApi = {
  /** 搜索产品 */
  async search(params: FilterParams): Promise<PaginatedResponse<Product>> {
    const qs = buildQueryString({ ...params, size: params?.size || 12 });
    return request<PaginatedResponse<Product>>(`/products/public/search?${qs}`);
  },

  /** 获取产品详情 */
  async getDetail(id: number): Promise<Product> {
    return request<Product>(`/products/public/${id}`);
  },

  /** 获取推荐产品 */
  async getRecommended(type?: string, size = 10): Promise<Product[]> {
    const qs = buildQueryString({ type, size });
    return request<Product[]>(`/products/public/recommended?${qs}`);
  },
};

// ==================== 行程服务 ====================
export const itineraryApi = {
  /** 获取行程列表 */
  async getList(params?: { userId?: number; isPublic?: boolean; page?: number; size?: number }): Promise<PaginatedResponse<Itinerary>> {
    const qs = buildQueryString({ ...params, size: params?.size || 10 });
    return request<PaginatedResponse<Itinerary>>(`/products/itineraries?${qs}`);
  },

  /** 获取行程详情 */
  async getDetail(id: number): Promise<Itinerary> {
    return request<Itinerary>(`/products/itineraries/${id}`);
  },

  /** 创建行程 */
  async create(data: Partial<Itinerary>): Promise<Itinerary> {
    return request<Itinerary>('/products/itineraries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** 更新行程 */
  async update(id: number, data: Partial<Itinerary>): Promise<Itinerary> {
    return request<Itinerary>(`/products/itineraries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** 删除行程 */
  async delete(id: number): Promise<void> {
    return request<void>(`/products/itineraries/${id}`, { method: 'DELETE' });
  },

  /** 点赞行程 */
  async like(id: number): Promise<void> {
    return request<void>(`/products/itineraries/${id}/like`, { method: 'POST' });
  },
};

// ==================== 订单服务 ====================
export const orderApi = {
  /** 创建订单 */
  async create(data: BookingFormData): Promise<Order> {
    return request<Order>('/orders/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** 获取订单列表 */
  async getList(params?: { status?: number; page?: number }): Promise<PaginatedResponse<Order>> {
    const qs = buildQueryString({ ...params, size: 10 });
    return request<PaginatedResponse<Order>>(`/orders/list?${qs}`);
  },

  /** 获取订单详情 */
  async getDetail(orderNo: string): Promise<Order> {
    return request<Order>(`/orders/${orderNo}`);
  },

  /** 取消订单 */
  async cancel(orderNo: string, reason: string): Promise<Order> {
    return request<Order>(`/orders/${orderNo}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  /** 申请退款 */
  async refund(orderNo: string, reason: string): Promise<Order> {
    return request<Order>(`/orders/${orderNo}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  /** 确认收货 */
  async confirm(orderNo: string): Promise<Order> {
    return request<Order>(`/orders/${orderNo}/confirm`, { method: 'POST' });
  },
};

// ==================== 支付服务 ====================
export const paymentApi = {
  /** 创建支付 */
  async create(orderId: number, amount: number, method: string): Promise<{ pay_url: string; qr_code?: string }> {
    return request<{ pay_url: string; qr_code?: string }>('/payments/create', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, method }),
    });
  },

  /** 查询支付状态 */
  async getStatus(transactionNo: string): Promise<{ status: number; message: string }> {
    return request<{ status: number; message: string }>(`/payments/status/${transactionNo}`);
  },
};

// ==================== 攻略服务 ====================
export const guideApi = {
  /** 获取攻略列表 */
  async getList(params?: { destinationId?: number; isFeatured?: boolean; page?: number }): Promise<PaginatedResponse<TravelGuide>> {
    const qs = buildQueryString({ ...params, size: 10 });
    return request<PaginatedResponse<TravelGuide>>(`/products/public/guides?${qs}`);
  },

  /** 获取攻略详情 */
  async getDetail(id: number): Promise<TravelGuide> {
    return request<TravelGuide>(`/products/public/guides/${id}`);
  },

  /** 获取精选攻略 */
  async getFeatured(size = 6): Promise<TravelGuide[]> {
    return request<TravelGuide[]>(`/products/public/guides/featured?size=${size}`);
  },

  /** 创建攻略 */
  async create(data: Partial<TravelGuide>): Promise<TravelGuide> {
    return request<TravelGuide>('/products/guides', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** 点赞攻略 */
  async like(id: number): Promise<void> {
    return request<void>(`/products/public/guides/${id}/like`, { method: 'POST' });
  },
};

// ==================== 评论服务 ====================
export const reviewApi = {
  /** 获取评论列表 */
  async getList(targetType: string, targetId: number, page = 0): Promise<PaginatedResponse<Review>> {
    return request<PaginatedResponse<Review>>(
      `/products/public/reviews?targetType=${targetType}&targetId=${targetId}&page=${page}&size=10`
    );
  },

  /** 创建评论 */
  async create(data: { target_type: string; target_id: number; rating: number; content: string; images?: string[]; order_id?: number }): Promise<Review> {
    return request<Review>('/products/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== 推荐服务 ====================
export const recommendApi = {
  /** 个性化推荐 */
  async getPersonalized(page = 0, size = 10): Promise<any[]> {
    return request<any[]>(`/recommend/personalized?page=${page}&size=${size}`);
  },

  /** 热门推荐 */
  async getHot(type?: string, page = 0, size = 10): Promise<any[]> {
    const qs = buildQueryString({ type, page, size });
    return request<any[]>(`/recommend/hot?${qs}`);
  },

  /** 相似推荐 */
  async getSimilar(itemId: number, type: string, size = 5): Promise<any[]> {
    return request<any[]>(`/recommend/similar/${itemId}?type=${type}&size=${size}`);
  },
};

// ==================== 通知服务 ====================
export const notificationApi = {
  /** 获取通知列表 */
  async getList(page = 0, size = 20): Promise<PaginatedResponse<Notification>> {
    return request<PaginatedResponse<Notification>>(`/notifications/list?page=${page}&size=${size}`);
  },

  /** 标记已读 */
  async markRead(id: number): Promise<void> {
    return request<void>(`/notifications/${id}/read`, { method: 'POST' });
  },

  /** 全部标记已读 */
  async markAllRead(): Promise<void> {
    return request<void>('/notifications/read-all', { method: 'POST' });
  },

  /** 获取未读数 */
  async getUnreadCount(): Promise<number> {
    const result = await request<{ count: number }>('/notifications/unread-count');
    return result.count;
  },
};

// ==================== 优惠券服务 ====================
export const couponApi = {
  /** 获取可用优惠券 */
  async getAvailable(productId?: number): Promise<any[]> {
    const qs = productId ? `?productId=${productId}` : '';
    return request<any[]>(`/users/coupons/available${qs}`);
  },

  /** 领取优惠券 */
  async claim(couponId: number): Promise<void> {
    return request<void>('/users/coupons/claim', {
      method: 'POST',
      body: JSON.stringify({ coupon_id: couponId }),
    });
  },

  /** 获取我的优惠券 */
  async getMy(params?: { isUsed?: boolean; page?: number }): Promise<PaginatedResponse<any>> {
    const qs = buildQueryString(params || {});
    return request<PaginatedResponse<any>>(`/users/coupons?${qs}`);
  },
};

// ==================== 管理端API ====================
export const adminApi = {
  /** 获取看板数据 */
  async getDashboard(): Promise<DashboardStats> {
    return request<DashboardStats>('/admin/dashboard');
  },

  /** 获取用户列表 */
  async getUsers(params?: FilterParams): Promise<PaginatedResponse<User>> {
    const qs = buildQueryString(params || {});
    return request<PaginatedResponse<User>>(`/admin/users?${qs}`);
  },

  /** 获取订单列表 */
  async getOrders(params?: FilterParams & { status?: number }): Promise<PaginatedResponse<Order>> {
    const qs = buildQueryString(params || {});
    return request<PaginatedResponse<Order>>(`/admin/orders?${qs}`);
  },

  /** 获取攻略列表 (管理端) */
  async getGuides(params?: FilterParams): Promise<PaginatedResponse<TravelGuide>> {
    const qs = buildQueryString(params || {});
    return request<PaginatedResponse<TravelGuide>>(`/admin/guides?${qs}`);
  },

  /** 审核攻略 */
  async reviewGuide(id: number, approved: boolean): Promise<void> {
    return request<void>(`/admin/guides/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ approved }),
    });
  },

  /** 获取AI对话日志 */
  async getAIConversations(params?: { userId?: number; page?: number }): Promise<PaginatedResponse<AIConversation>> {
    const qs = buildQueryString({ ...params, size: 20 });
    return request<PaginatedResponse<AIConversation>>(`/admin/ai/conversations?${qs}`);
  },

  /** 获取知识库状态 */
  async getKnowledgeStatus(): Promise<{ total: number; types: Record<string, number> }> {
    return request<{ total: number; types: Record<string, number> }>('/admin/ai/knowledge/status');
  },
};

// ==================== AI服务 ====================
export const aiApi = {
  /** 普通对话 */
  async chat(sessionId: string, message: string, history?: any[]): Promise<{ answer: string; sources: string[]; tools_used: any[] }> {
    const response = await fetch(`${AI_BASE}/chat/completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message, history }),
    });
    if (!response.ok) throw new Error('AI服务异常');
    return response.json();
  },

  /** 流式对话 */
  async chatStream(
    sessionId: string,
    message: string,
    onChunk: (text: string) => void,
    onDone?: () => void
  ): Promise<void> {
    const token = getToken();
    const response = await fetch(`${AI_BASE}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ session_id: sessionId, message }),
    });

    if (!response.ok) throw new Error('AI服务异常');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) {
        onDone?.();
        break;
      }

      const text = decoder.decode(value);
      const lines = text.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') {
          onDone?.();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) onChunk(parsed.content);
        } catch {
          // 跳过解析失败的行
        }
      }
    }
  },

  /** 生成行程 */
  async generateItinerary(data: {
    destination: string;
    start_date: string;
    days: number;
    travelers: number;
    budget?: number;
    preferences: string[];
    travel_style: string;
  }): Promise<any> {
    const response = await fetch(`${AI_BASE}/itinerary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('行程生成失败');
    return response.json();
  },

  /** 优化行程 */
  async optimizeItinerary(itinerary: any, feedback: string): Promise<any> {
    const response = await fetch(`${AI_BASE}/itinerary/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itinerary, feedback }),
    });
    if (!response.ok) throw new Error('行程优化失败');
    return response.json();
  },

  /** 获取AI推荐 */
  async getRecommendations(userId: number, preferences?: string[]): Promise<any> {
    const response = await fetch(`${AI_BASE}/recommend/destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, preferences }),
    });
    if (!response.ok) throw new Error('推荐获取失败');
    return response.json();
  },

  /** 上传图片识别 */
  async recognizeImage(imageBase64: string): Promise<{ objects: string[]; scene: string; suggestions: string[] }> {
    const response = await fetch(`${AI_BASE}/vision/recognize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });
    if (!response.ok) throw new Error('图片识别失败');
    return response.json();
  },

  /** 翻译文本 */
  async translate(text: string, targetLang: string): Promise<string> {
    const response = await fetch(`${AI_BASE}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target_lang: targetLang }),
    });
    const result = await response.json();
    return result.translated;
  },
};

// ==================== 兼容旧接口 ====================
/** @deprecated 使用具体模块的API替代 */
export const api = {
  login: userApi.login,
  register: userApi.register,
  getUserProfile: userApi.getProfile,
  updateProfile: userApi.updateProfile,
  getDestinations: destinationApi.getList,
  getDestinationDetail: destinationApi.getDetail,
  getPOIs: poiApi.getList,
  searchProducts: productApi.search,
  getProductDetail: productApi.getDetail,
  getItineraries: itineraryApi.getList,
  getItineraryDetail: itineraryApi.getDetail,
  saveItinerary: itineraryApi.create,
  createOrder: orderApi.create,
  getOrders: orderApi.getList,
  getOrderDetail: orderApi.getDetail,
  cancelOrder: orderApi.cancel,
  createPayment: paymentApi.create,
  getGuides: guideApi.getList,
  getGuideDetail: guideApi.getDetail,
  getRecommendations: recommendApi.getPersonalized,
  getHotItems: recommendApi.getHot,
  getSimilarItems: recommendApi.getSimilar,
  getNotifications: notificationApi.getList,
  markNotificationRead: notificationApi.markRead,
};

/** @deprecated 使用 aiApi 替代 */
export const aiClient = aiApi;
