"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "echo-theme";
const THEMES: Theme[] = ["light", "dark", "system"];

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEMES.includes(value as Theme);
}

function getSystemIsDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getCachedTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const cachedTheme = window.localStorage.getItem(STORAGE_KEY);
  return isTheme(cachedTheme) ? cachedTheme : "system";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  const shouldUseDark = theme === "dark" || (theme === "system" && getSystemIsDark());
  document.documentElement.classList.toggle("dark", shouldUseDark);
}

async function saveTheme(theme: Theme) {
  const response = await fetch("/api/theme", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme }),
  });

  if (!response.ok) {
    throw new Error("Impossible de sauvegarder le thème");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getCachedTheme);
  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    setSystemIsDark(getSystemIsDark());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadTheme() {
      try {
        const response = await fetch("/api/theme", {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = await response.json();
        if (!cancelled && isTheme(data.theme)) {
          setThemeState(data.theme);
          window.localStorage.setItem(STORAGE_KEY, data.theme);
          applyTheme(data.theme);
        }
      } catch {
        // Le cache local garde l'interface cohérente si la préférence serveur échoue.
      }
    }

    applyTheme(theme);
    loadTheme();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, systemIsDark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemIsDark(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);

    saveTheme(nextTheme).catch((error) => {
      console.error("[useTheme]", error);
    });
  }, []);

  const isDark = useMemo(() => {
    return theme === "dark" || (theme === "system" && systemIsDark);
  }, [theme, systemIsDark]);

  return { theme, setTheme, isDark };
}
