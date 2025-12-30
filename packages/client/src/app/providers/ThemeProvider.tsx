import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { themes, defaultTheme } from '../config/themes';
import type { Theme } from '../config/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'gmss-crm-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  // Load saved theme on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeId) {
      const theme = themes.find(t => t.id === savedThemeId);
      if (theme) {
        applyTheme(theme);
        setCurrentTheme(theme);
      }
    } else {
      applyTheme(defaultTheme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply all CSS variables
    root.style.setProperty('--bg-app', theme.colors.bgApp);
    root.style.setProperty('--bg-panel', theme.colors.bgPanel);
    root.style.setProperty('--bg-muted', theme.colors.bgMuted);
    root.style.setProperty('--bg-sidebar', theme.colors.bgSidebar);
    root.style.setProperty('--bg-sidebar-accent', theme.colors.bgSidebarAccent);
    root.style.setProperty('--bg-hover', theme.colors.bgHover);
    root.style.setProperty('--bg-selected', theme.colors.bgSelected);
    
    root.style.setProperty('--text-primary', theme.colors.textPrimary);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--text-tertiary', theme.colors.textTertiary);
    root.style.setProperty('--text-invert', theme.colors.textInvert);
    
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--accent-hover', theme.colors.accentHover);
    root.style.setProperty('--accent-light', theme.colors.accentLight);
    root.style.setProperty('--accent-lighter', theme.colors.accentLighter);
    
    root.style.setProperty('--border-color', theme.colors.borderColor);
    root.style.setProperty('--border-light', theme.colors.borderLight);
    root.style.setProperty('--border-lighter', theme.colors.borderLighter);
    root.style.setProperty('--border-input', theme.colors.borderInput);
    
    root.style.setProperty('--scrollbar-track', theme.colors.scrollbarTrack);
    root.style.setProperty('--scrollbar-thumb', theme.colors.scrollbarThumb);
    root.style.setProperty('--scrollbar-thumb-hover', theme.colors.scrollbarThumbHover);
    
    root.style.setProperty('--color-success', theme.colors.colorSuccess);
    root.style.setProperty('--color-error', theme.colors.colorError);
  };

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      applyTheme(theme);
      setCurrentTheme(theme);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
