/**
 * Light or dark theme, set as <html data-theme="…"> (colors in globals.css). The theme picked with the
 * header's button (components/ThemeToggle) is remembered in localStorage; without one, the site
 * follows the system setting.
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Runs in <head> while the page loads, before anything is shown, so the page never flashes in the
 * wrong theme. Plain JavaScript, written out as text (layout.tsx inlines it).
 */
export const THEME_SCRIPT = `(function () {
  try {
    var theme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (theme !== 'light' && theme !== 'dark') {
      theme = matchMedia(${JSON.stringify(SYSTEM_DARK_QUERY)}).matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();`;

/** The theme picked with the button, or null to follow the system setting */
export function storedTheme(): Theme | null {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme === 'light' || theme === 'dark' ? theme : null;
  } catch {
    // localStorage can be blocked, e.g. in some private browsing modes
    return null;
  }
}

export function systemTheme(): Theme {
  return matchMedia(SYSTEM_DARK_QUERY).matches ? 'dark' : 'light';
}
