import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: 'user' | 'admin') => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string, role = 'user') => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (password.length < 3) {
          set({ isLoading: false });
          throw new Error('Invalid password');
        }

        const mockUser: AuthUser = {
          id: role === 'admin' ? 'admin1' : `user_${Date.now()}`,
          email,
          name: email.split('@')[0],
          role,
        };

        set({ user: mockUser, isLoading: false });
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (password.length < 3) {
          set({ isLoading: false });
          throw new Error('Password must be at least 3 characters');
        }

        const newUser: AuthUser = {
          id: `user_${Date.now()}`,
          email,
          name,
          role: 'user',
        };

        set({ user: newUser, isLoading: false });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
