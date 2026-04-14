"use client";

import { useState, useEffect } from "react";

const LIGHT_VARS: Record<string, string> = {
  "--color-docebo-dark": "#f5f3ef",
  "--color-docebo-card": "#ffffff",
  "--color-docebo-border": "#d9d3c9",
  "--color-docebo-muted": "#6b7280",
  "--color-docebo-midnight": "#f0ece6",
};

function applyTheme(light: boolean) {
  const root = document.documentElement;
  if (light) {
    root.classList.add("light");
    root.classList.remove("dark");
    for (const [key, val] of Object.entries(LIGHT_VARS)) {
      root.style.setProperty(key, val);
    }
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
    for (const key of Object.keys(LIGHT_VARS)) {
      root.style.removeProperty(key);
    }
  }
}

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      setLight(true);
      applyTheme(true);
    }
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    applyTheme(next);
    localStorage.setItem("theme", next ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      className="relative w-12 h-6 rounded-full bg-docebo-card border border-docebo-border transition-colors flex items-center px-0.5"
    >
      <span
        className={`absolute w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
          light
            ? "translate-x-6 bg-amber-400 text-amber-900"
            : "translate-x-0 bg-docebo-blue text-white"
        }`}
      >
        {light ? "\u2600" : "\u263E"}
      </span>
    </button>
  );
}
