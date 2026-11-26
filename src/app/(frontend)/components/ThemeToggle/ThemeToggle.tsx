'use client';

import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useLayoutEffect } from 'react';

import {
  SYSTEM_DARK_QUERY,
  THEME_STORAGE_KEY,
  storedTheme,
  systemTheme,
  type Theme,
} from '@/lib/theme';
import './ThemeToggle.css';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

/**
 * Switches between light and dark, and remembers the choice. The icon shows the theme you switch to,
 * picked with CSS from <html data-theme>, so the server and the browser render the same button.
 */
export function ThemeToggle() {
  // In development React resets <html>'s attributes when it remounts, clearing the theme the <head>
  // script set; set it again before the page is painted. Does nothing in production.
  useLayoutEffect(() => {
    applyTheme(storedTheme() ?? systemTheme());
  }, []);

  // Follow changes to the system setting, as long as no theme was picked with the button
  useEffect(() => {
    const controller = new AbortController();
    matchMedia(SYSTEM_DARK_QUERY).addEventListener(
      'change',
      () => {
        if (!storedTheme()) {
          applyTheme(systemTheme());
        }
      },
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, []);

  async function toggle() {
    const next: Theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Not remembered when localStorage is blocked, but still switched for this page
    }

    // Instant where the browser can't animate it, or the system asks for less motion
    if (!document.startViewTransition || matchMedia(REDUCED_MOTION_QUERY).matches) {
      applyTheme(next);
      return;
    }

    // The new theme grows as a circle until it covers the whole window: dark from the top right
    // corner, light from the bottom left. The browser shows a snapshot of the old page underneath
    // (default fade off in globals.css).
    const x = next === 'dark' ? innerWidth : 0;
    const y = next === 'dark' ? 0 : innerHeight;
    // From one corner, the farthest point is the opposite corner
    const radius = Math.hypot(innerWidth, innerHeight);

    const transition = document.startViewTransition(() => applyTheme(next));
    await transition.ready;
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: 500,
        // Same as --ease in globals.css
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  }

  return (
    <button
      aria-label="Växla mellan ljust och mörkt läge"
      className="theme-toggle"
      onClick={toggle}
      title="Växla mellan ljust och mörkt läge"
      type="button"
    >
      <Moon className="theme-icon-to-dark" size={20} />
      <Sun className="theme-icon-to-light" size={20} />
    </button>
  );
}
