// import { User, UserRes } from "@/types/user";
import { create } from "zustand";

type AuthUser = {
  username: string;
  email: string;
  avatar?: string;
};

type AuthStore = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearIsAuthenticated: () => void;
};

export const useAuth = create<AuthStore>()((set) => {
  return {
    isAuthenticated: false,
    user: null,
    setUser: (user: AuthUser) => {
      return set({ user, isAuthenticated: true });
    },
    clearIsAuthenticated: () =>
      set({
        isAuthenticated: false,
        user: null,
      }),
  };
});