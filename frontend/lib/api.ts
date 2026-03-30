import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse, SearchResult, Product, Itinerary, Order, User, SearchParams, ChatMessage } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    // 请求拦截器 - 添加token
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 用户相关
  user = {
    login: (phone: string, code: string) =>
      this.client.post<ApiResponse<{ token: string; user: User }>>('/api/user/login', { phone, code }),
    getProfile: () =>
      this.client.get<ApiResponse<User>>('/api/user/profile'),
    updateProfile: (data: Partial<User>) =>
      this.client.put<ApiResponse<User>>('/api/user/profile', data),
  };

  // 产品相关
  products = {
    search: (params: SearchParams) =>
      this.client.get<ApiResponse<SearchResult<Product>>>('/api/products/search', { params }),
    getById: (id: number) =>
      this.client.get<ApiResponse<Product>>(`/api/products/${id}`),
    getByType: (type: string, page = 1) =>
      this.client.get<ApiResponse<SearchResult<Product>>>(`/api/products/type/${type}`, { params: { page } }),
  };

  // 行程相关
  itineraries = {
    generate: (params: { destination: string; days: number; preferences: Record<string, any> }) =>
      this.client.post<ApiResponse<Itinerary>>('/api/itinerary/generate', params),
    list: () =>
      this.client.get<ApiResponse<Itinerary[]>>('/api/itinerary/list'),
    getById: (id: number) =>
      this.client.get<ApiResponse<Itinerary>>(`/api/itinerary/${id}`),
    save: (itinerary: Partial<Itinerary>) =>
      this.client.post<ApiResponse<Itinerary>>('/api/itinerary/save', itinerary),
    update: (id: number, data: Partial<Itinerary>) =>
      this.client.put<ApiResponse<Itinerary>>(`/api/itinerary/${id}`, data),
    delete: (id: number) =>
      this.client.delete<ApiResponse<void>>(`/api/itinerary/${id}`),
  };

  // 订单相关
  orders = {
    create: (productId: number, quantity: number) =>
      this.client.post<ApiResponse<Order>>('/api/order/create', { productId, quantity }),
    list: (page = 1) =>
      this.client.get<ApiResponse<SearchResult<Order>>>('/api/order/list', { params: { page } }),
    getById: (orderNo: string) =>
      this.client.get<ApiResponse<Order>>(`/api/order/${orderNo}`),
    cancel: (orderNo: string) =>
      this.client.post<ApiResponse<void>>(`/api/order/${orderNo}/cancel`),
  };

  // AI助手
  ai = {
    chat: (sessionId: string, message: string) =>
      this.client.post<ApiResponse<ChatMessage>>('/api/ai/chat', { sessionId, message }),
    getHistory: (sessionId: string) =>
      this.client.get<ApiResponse<ChatMessage[]>>(`/api/ai/history/${sessionId}`),
  };

  // 推荐
  recommend = {
    getPersonalized: () =>
      this.client.get<ApiResponse<Product[]>>('/api/recommend/personalized'),
    getTrending: () =>
      this.client.get<ApiResponse<Product[]>>('/api/recommend/trending'),
    getSimilar: (productId: number) =>
      this.client.get<ApiResponse<Product[]>>(`/api/recommend/similar/${productId}`),
  };
}

export const api = new ApiClient();
