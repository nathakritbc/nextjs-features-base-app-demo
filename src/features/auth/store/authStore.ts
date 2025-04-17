import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setAuth: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetAuth: () => set({ isAuthenticated: false, error: null }),
}));
