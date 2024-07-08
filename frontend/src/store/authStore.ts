import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  setAuth: (user: any, accessToken: string) => void;
  removeAuth: () => void;
  setUser: (user: any) => void;
}

const authStore = (set: any): AuthState => ({
  user: null,
  accessToken: null,
  setAuth: (user: any, accessToken: string) => {
    set(() => ({
      user,
      accessToken,
    }));
  },
  removeAuth: () => {
    set(() => ({
      user: null,
      accessToken: null,
    }));
  },
  setUser: (user: any) => {
    set(() => ({
      user,
    }));
  },
});

const useAuthStore = create(
  devtools(
    persist(authStore, {
      name: "auth",
    })
  )
);

export default useAuthStore;
