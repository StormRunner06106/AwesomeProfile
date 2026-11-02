"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { applyTheme, normalizeTheme, THEMES, THEME_STORAGE_KEY } from "@/lib/themes";

export default function ThemeSelector() {
  const [preference, setPreference] = useState("system");

  useEffect(() => {
    const initial = normalizeTheme(document.documentElement.dataset.themePreference);
    setPreference(initial);
    applyTheme(initial);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (document.documentElement.dataset.themePreference === "system") applyTheme("system");
    };
    const onStorageChange = (event) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      const choice = normalizeTheme(event.newValue);
      setPreference(choice);
      applyTheme(choice);
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorageChange);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  function selectTheme(event) {
    const choice = normalizeTheme(event.target.value);
    setPreference(choice);
    applyTheme(choice);
    try { localStorage.setItem(THEME_STORAGE_KEY, choice); } catch {}
  }

  return (
    <label className="relative inline-flex items-center gap-2 rounded-2xl border border-line bg-surface/90 px-3 text-ink shadow-sm focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-accent">
      <FontAwesomeIcon icon={faPalette} className="h-4 w-4 text-accent" aria-hidden="true" />
      <span className="sr-only">Color theme</span>
      <select
        value={preference}
        onChange={selectTheme}
        className="title min-h-11 w-24 cursor-pointer appearance-none bg-transparent py-2 pr-4 text-base outline-none">
        <option value="system" className="bg-surface text-ink">System</option>
        {THEMES.map((theme) => (
          <option key={theme.id} value={theme.id} className="bg-surface text-ink">{theme.name}</option>
        ))}
      </select>
      <FontAwesomeIcon icon={faChevronDown} className="pointer-events-none absolute right-3 h-3 w-3 text-muted" aria-hidden="true" />
    </label>
  );
}
