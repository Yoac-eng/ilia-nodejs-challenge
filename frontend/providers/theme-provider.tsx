"use client";

import { useEffect } from "react";

import { useThemeStore } from "@/lib/theme-store";

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { theme, isHydrated, initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [isHydrated, theme]);

  return <>{children}</>;
}

