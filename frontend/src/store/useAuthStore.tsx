import { create } from "zustand";
import { login as loginApi, register as registerApi, logout as logoutApi, getUser as getUserApi } from "@/api/auth.js";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles?: string[];
  permissions?: string[];
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const response = await getUserApi();
      set({ user: response?.user || null });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  login: async (data) => {
    const response = await loginApi(data);
    set({ user: response?.user || null });
  },

  register: async (data) => {
    const response = await registerApi(data);
    set({ user: response?.user || null });
  },

  logout: async () => {
    await logoutApi();
    set({ user: null });
  },

  hasPermission: (permissionName: string) => {
    const user = get().user;
    if (!user) return false;
    return user.permissions?.includes(permissionName) || false;
  },
}));