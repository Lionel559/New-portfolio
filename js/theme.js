(function () {
  const STORAGE_KEY = "portfolio-theme";
  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      return;
    }
  }

  function getPreferredTheme() {
    const storedTheme = getStoredTheme();
    if (storedTheme === "dark" || storedTheme === "light") return storedTheme;
    return mediaQuery.matches ? "dark" : "light";
  }

  function updateToggle(theme) {
    const button = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-toggle-icon");
    if (!button || !icon) return;

    const isDark = theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    icon.innerHTML = isDark ? "&#9788;" : "&#9790;";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateToggle(theme);
  }

  function setTheme(theme) {
    saveTheme(theme);
    applyTheme(theme);
  }

  applyTheme(getPreferredTheme());

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", () => {
      if (!getStoredTheme()) applyTheme(getPreferredTheme());
    });
  }

  function initThemeToggle() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    updateToggle(root.dataset.theme || getPreferredTheme());

    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
