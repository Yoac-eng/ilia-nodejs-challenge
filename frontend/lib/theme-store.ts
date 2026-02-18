import { create } from "zustand";

export type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  isHydrated: boolean;
  initializeTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",
  isHydrated: false,
  initializeTheme: () => {
    if (typeof window === "undefined") {
      return;
    }

    // theme needs the document element to be available to toggle the dark class
    // that happens because we are a className based theme
    const storedTheme = window.localStorage.getItem("theme");
    const initialTheme: Theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";

    set({ theme: initialTheme, isHydrated: true });
  },
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => {
    const nextTheme: Theme = get().theme === "dark" ? "light" : "dark";
    set({ theme: nextTheme });
  },
}));

