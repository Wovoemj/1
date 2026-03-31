/**
 * TravelAI - 全局状态管理
 * 基于 React Context + useReducer 的轻量级状态管理
 */
import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { User, Itinerary, Notification } from '@/types';

// ==================== State Types ====================
interface AppState {
  // 用户
  user: User | null;
  isAuthenticated: boolean;

  // 当前行程
  currentItinerary: Itinerary | null;

  // UI状态
  isLoading: boolean;
  error: string | null;

  // 搜索
  searchQuery: string;
  searchHistory: string[];

  // 通知
  notifications: Notification[];
  unreadCount: number;

  // AI对话
  chatSessionId: string | null;

  // 主题
  theme: 'light' | 'dark';
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'SET_CURRENT_ITINERARY'; payload: Itinerary | null }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'MARK_NOTIFICATION_READ'; payload: number }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'SET_CHAT_SESSION'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'CLEAR_ERROR' };

// ==================== Initial State ====================
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentItinerary: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  searchHistory: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('searchHistory') || '[]')
    : [],
  notifications: [],
  unreadCount: 0,
  chatSessionId: null,
  theme: 'light',
};

// ==================== Reducer ====================
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        currentItinerary: null,
        notifications: [],
        unreadCount: 0,
        chatSessionId: null,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'ADD_SEARCH_HISTORY': {
      const history = [action.payload, ...state.searchHistory.filter(h => h !== action.payload)].slice(0, 10);
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchHistory', JSON.stringify(history));
      }
      return { ...state, searchHistory: history };
    }

    case 'CLEAR_SEARCH_HISTORY':
      if (typeof window !== 'undefined') {
        localStorage.removeItem('searchHistory');
      }
      return { ...state, searchHistory: [] };

    case 'SET_CURRENT_ITINERARY':
      return { ...state, currentItinerary: action.payload };

    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };

    case 'SET_CHAT_SESSION':
      return { ...state, chatSessionId: action.payload };

    case 'SET_THEME':
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        document.documentElement.setAttribute('data-theme', action.payload);
      }
      return { ...state, theme: action.payload };

    default:
      return state;
  }
}

// ==================== Context ====================
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// ==================== Convenience Hooks ====================
export function useUser() {
  const { state, dispatch } = useApp();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    setUser: (user: User | null) => dispatch({ type: 'SET_USER', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  };
}

export function useSearch() {
  const { state, dispatch } = useApp();
  return {
    query: state.searchQuery,
    history: state.searchHistory,
    setQuery: (q: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: q }),
    addToHistory: (q: string) => dispatch({ type: 'ADD_SEARCH_HISTORY', payload: q }),
    clearHistory: () => dispatch({ type: 'CLEAR_SEARCH_HISTORY' }),
  };
}

export function useLoading() {
  const { state, dispatch } = useApp();
  return {
    isLoading: state.isLoading,
    error: state.error,
    setLoading: (v: boolean) => dispatch({ type: 'SET_LOADING', payload: v }),
    setError: (e: string | null) => dispatch({ type: 'SET_ERROR', payload: e }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };
}

export function useNotifications() {
  const { state, dispatch } = useApp();
  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    setNotifications: (n: Notification[]) => dispatch({ type: 'SET_NOTIFICATIONS', payload: n }),
    markRead: (id: number) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id }),
    setUnreadCount: (c: number) => dispatch({ type: 'SET_UNREAD_COUNT', payload: c }),
  };
}

export function useTheme() {
  const { state, dispatch } = useApp();
  return {
    theme: state.theme,
    toggleTheme: () => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' }),
    setTheme: (t: 'light' | 'dark') => dispatch({ type: 'SET_THEME', payload: t }),
  };
}
