/**
 * API 客户端 - 统一管理所有API请求
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const AI_BASE = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000/api/ai';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  // ==================== 用户相关 ====================
  async login(phone: string, code: string) {
    return this.request<{ token: string; user: any }>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }

  async register(data: { phone: string; code: string; nickname: string }) {
    return this.request<{ token: string; user: any }>('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserProfile() {
    return this.request<any>('/users/profile');
  }

  async updateProfile(data: any) {
    return this.request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==================== 目的地相关 ====================
  async getDestinations(params?: { page?: number; size?: number; tags?: string[] }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.size) query.set('size', String(params.size));
    if (params?.tags) query.set('tags', params.tags.join(','));
    return this.request<any[]>(`/products/public/destinations?${query}`);
  }

  async getDestinationDetail(id: number) {
    return this.request<any>(`/products/public/destinations/${id}`);
  }

  async getPOIs(destinationId: number, type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request<any[]>(`/products/public/pois?destinationId=${destinationId}${query}`);
  }

  // ==================== 产品相关 ====================
  async searchProducts(params: {
    type: string;
    destination?: string;
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, String(value));
    });
    return this.request<any[]>(`/products/public/search?${query}`);
  }

  async getProductDetail(id: number) {
    return this.request<any>(`/products/public/${id}`);
  }

  // ==================== 行程相关 ====================
  async getItineraries(params?: { userId?: number; isPublic?: boolean; page?: number }) {
    const query = new URLSearchParams();
    if (params?.userId) query.set('userId', String(params.userId));
    if (params?.isPublic !== undefined) query.set('isPublic', String(params.isPublic));
    if (params?.page) query.set('page', String(params.page));
    return this.request<any[]>(`/products/itineraries?${query}`);
  }

  async getItineraryDetail(id: number) {
    return this.request<any>(`/products/itineraries/${id}`);
  }

  async saveItinerary(data: any) {
    return this.request<any>('/products/itineraries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== 订单相关 ====================
  async createOrder(data: { productId: number; quantity: number; useDate: string; remark?: string }) {
    return this.request<any>('/orders/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders(params?: { status?: number; page?: number }) {
    const query = new URLSearchParams();
    if (params?.status !== undefined) query.set('status', String(params.status));
    if (params?.page) query.set('page', String(params.page));
    return this.request<any[]>(`/orders/list?${query}`);
  }

  async getOrderDetail(orderNo: string) {
    return this.request<any>(`/orders/${orderNo}`);
  }

  async cancelOrder(orderNo: string, reason: string) {
    return this.request<any>(`/orders/${orderNo}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // ==================== 支付相关 ====================
  async createPayment(orderId: number, amount: number, method: string) {
    return this.request<any>('/payments/create', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount, method }),
    });
  }

  // ==================== 攻略/游记 ====================
  async getGuides(params?: { destinationId?: number; isFeatured?: boolean; page?: number }) {
    const query = new URLSearchParams();
    if (params?.destinationId) query.set('destinationId', String(params.destinationId));
    if (params?.isFeatured !== undefined) query.set('isFeatured', String(params.isFeatured));
    if (params?.page) query.set('page', String(params.page));
    return this.request<any[]>(`/products/public/guides?${query}`);
  }

  async getGuideDetail(id: number) {
    return this.request<any>(`/products/public/guides/${id}`);
  }

  // ==================== 推荐相关 ====================
  async getRecommendations(page = 0, size = 10) {
    return this.request<any[]>(`/recommend/personalized?page=${page}&size=${size}`);
  }

  async getHotItems(type?: string, page = 0, size = 10) {
    return this.request<any[]>(`/recommend/hot?type=${type}&page=${page}&size=${size}`);
  }

  async getSimilarItems(itemId: number, type: string, size = 5) {
    return this.request<any[]>(`/recommend/similar/${itemId}?type=${type}&size=${size}`);
  }

  // ==================== 通知相关 ====================
  async getNotifications(page = 0, size = 20) {
    return this.request<any[]>(`/notifications/list?page=${page}&size=${size}`);
  }

  async markNotificationRead(id: number) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'POST' });
  }
}

// AI API 客户端
class AIClient {
  async chat(sessionId: string, message: string, history?: any[]) {
    const response = await fetch(`${AI_BASE}/chat/completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message, history }),
    });
    return response.json();
  }

  async chatStream(sessionId: string, message: string, onChunk: (text: string) => void) {
    const response = await fetch(`${AI_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const lines = text.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          onChunk(parsed.content);
        } catch {}
      }
    }
  }

  async generateItinerary(data: {
    destination: string;
    start_date: string;
    days: number;
    travelers: number;
    budget?: number;
    preferences: string[];
    travel_style: string;
  }) {
    const response = await fetch(`${AI_BASE}/itinerary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async optimizeItinerary(itinerary: any, feedback: string) {
    const response = await fetch(`${AI_BASE}/itinerary/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itinerary, feedback }),
    });
    return response.json();
  }

  async getRecommendations(userId: number, preferences?: string[]) {
    const response = await fetch(`${AI_BASE}/recommend/destinations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, preferences }),
    });
    return response.json();
  }
}

export const api = new ApiClient();
export const aiClient = new AIClient();
