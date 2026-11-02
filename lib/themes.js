export const THEME_STORAGE_KEY = "lucas-portfolio-theme";

export const THEMES = [
  { id: "classic", name: "Classic", background: "#e6e6e6" },
  { id: "midnight", name: "Midnight", background: "#10141c" },
  { id: "ocean", name: "Ocean", background: "#e7f2f7" },
  { id: "forest", name: "Forest", background: "#edf2ec" },
  { id: "sand", name: "Sand", background: "#f4ede1" },
];

export function normalizeTheme(preference) {
  return THEMES.some((theme) => theme.id === preference) ? preference : "system";
}

export function applyTheme(preference) {
  const choice = normalizeTheme(preference);
  const resolved = choice === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "midnight" : "classic")
    : choice;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = choice;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  themeColor?.setAttribute("content", THEMES.find((theme) => theme.id === resolved).background);
}

// Run before the first paint so a saved dark theme never flashes the light palette.
export const themeInitializationScript = `(() => {
  let choice = "system";
  try { choice = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) || "system"; } catch {}
  const choices = ${JSON.stringify(THEMES.map((theme) => theme.id))};
  if (!choices.includes(choice)) choice = "system";
  document.documentElement.dataset.themePreference = choice;
  document.documentElement.dataset.theme = choice === "system"
    ? (matchMedia("(prefers-color-scheme: dark)").matches ? "midnight" : "classic")
    : choice;
})();`;
