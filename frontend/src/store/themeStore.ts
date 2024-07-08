import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: any) => void;
}

const themeStore = (set: any): ThemeState => ({
  theme: "light",
  toggleTheme: () =>
    set((state: ThemeState) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
  setTheme: (theme: any) =>
    set(() => ({
      theme,
    })),
});

const useThemeStore = create(
  devtools(
    persist(themeStore, {
      name: "theme",
    })
  )
);

export default useThemeStore;
