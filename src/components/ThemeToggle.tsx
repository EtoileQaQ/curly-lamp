"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { type Theme, useTheme } from "@/hooks/useTheme";

const THEME_ORDER: Theme[] = ["light", "dark", "system"];

const THEME_LABELS: Record<Theme, string> = {
  light: "Mode clair",
  dark: "Mode sombre",
  system: "Mode système",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  function cycleTheme() {
    const currentIndex = THEME_ORDER.indexOf(theme);
    const nextTheme = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={THEME_LABELS[theme]}
      aria-label={THEME_LABELS[theme]}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
