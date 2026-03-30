import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ChatMessage, Itinerary } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    { name: 'auth-storage' }
  )
);

interface ChatState {
  sessionId: string;
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  toggleChat: () => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  sessionId: `session_${Date.now()}`,
  messages: [],
  isOpen: false,
  isLoading: false,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setLoading: (isLoading) => set({ isLoading }),
  clearChat: () => set({ messages: [], sessionId: `session_${Date.now()}` }),
}));

interface PlannerState {
  currentItinerary: Partial<Itinerary> | null;
  searchParams: {
    destination: string;
    days: number;
    startDate: string;
    budget: number;
  };
  setItinerary: (itinerary: Partial<Itinerary>) => void;
  updateSearchParams: (params: Partial<PlannerState['searchParams']>) => void;
  reset: () => void;
}

export const usePlannerStore = create<PlannerState>()((set) => ({
  currentItinerary: null,
  searchParams: {
    destination: '',
    days: 3,
    startDate: '',
    budget: 5000,
  },
  setItinerary: (currentItinerary) => set({ currentItinerary }),
  updateSearchParams: (params) =>
    set((state) => ({ searchParams: { ...state.searchParams, ...params } })),
  reset: () =>
    set({
      currentItinerary: null,
      searchParams: { destination: '', days: 3, startDate: '', budget: 5000 },
    }),
}));
