/**
 * Theme Configuration
 * Pre-defined color palettes for the CRM system
 */

export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  colors: {
    bgApp: string;
    bgPanel: string;
    bgMuted: string;
    bgSidebar: string;
    bgSidebarAccent: string;
    bgHover: string;
    bgSelected: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textInvert: string;
    accent: string;
    accentHover: string;
    accentMedium: string;
    accentLight: string;
    accentLighter: string;
    borderColor: string;
    borderLight: string;
    borderLighter: string;
    borderInput: string;
    scrollbarTrack: string;
    scrollbarThumb: string;
    scrollbarThumbHover: string;
    colorSuccess: string;
    colorError: string;
  };
}

export const themes: Theme[] = [
  // 1. Ocean Blue - Professional & Trustworthy
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Professional and trustworthy',
    icon: '🌊',
    colors: {
      bgApp: '#f5f7ff',
      bgPanel: '#ffffff',
      bgMuted: '#f0f4ff',
      bgSidebar: '#071233',
      bgSidebarAccent: '#081730',
      bgHover: '#fafafa',
      bgSelected: '#f5f5f5',
      textPrimary: '#262626',
      textSecondary: '#8c8c8c',
      textTertiary: '#595959',
      textInvert: '#ffffff',
      accent: '#0066cc',
      accentHover: '#0052a3',
      accentMedium: 'rgba(0, 102, 204, 0.35)',
      accentLight: 'rgba(0, 102, 204, 0.1)',
      accentLighter: 'rgba(0, 102, 204, 0.05)',
      borderColor: '#e8e8e8',
      borderLight: '#f0f0f0',
      borderLighter: '#f5f5f5',
      borderInput: '#d9d9d9',
      scrollbarTrack: '#f1f1f1',
      scrollbarThumb: '#bfbfbf',
      scrollbarThumbHover: '#8c8c8c',
      colorSuccess: '#52c41a',
      colorError: '#ff4d4f',
    },
  },

  // 2. Emerald Green - Fresh & Modern
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    description: 'Fresh and vibrant',
    icon: '🌿',
    colors: {
      bgApp: '#f0fdf4',
      bgPanel: '#ffffff',
      bgMuted: '#dcfce7',
      bgSidebar: '#064e3b',
      bgSidebarAccent: '#065f46',
      bgHover: '#f0fdf4',
      bgSelected: '#d1fae5',
      textPrimary: '#064e3b',
      textSecondary: '#6b7280',
      textTertiary: '#374151',
      textInvert: '#ffffff',
      accent: '#10b981',
      accentHover: '#059669',
      accentMedium: 'rgba(16, 185, 129, 0.35)',
      accentLight: 'rgba(16, 185, 129, 0.1)',
      accentLighter: 'rgba(16, 185, 129, 0.05)',
      borderColor: '#d1d5db',
      borderLight: '#e5e7eb',
      borderLighter: '#f3f4f6',
      borderInput: '#d1d5db',
      scrollbarTrack: '#f1f5f9',
      scrollbarThumb: '#cbd5e1',
      scrollbarThumbHover: '#94a3b8',
      colorSuccess: '#10b981',
      colorError: '#ef4444',
    },
  },

  // 3. Purple Professional - Premium & Elegant
  {
    id: 'purple-professional',
    name: 'Purple Royal',
    description: 'Premium and elegant',
    icon: '👑',
    colors: {
      bgApp: '#faf5ff',
      bgPanel: '#ffffff',
      bgMuted: '#f3e8ff',
      bgSidebar: '#1e1b4b',
      bgSidebarAccent: '#312e81',
      bgHover: '#faf5ff',
      bgSelected: '#f3e8ff',
      textPrimary: '#1e1b4b',
      textSecondary: '#6b7280',
      textTertiary: '#374151',
      textInvert: '#ffffff',
      accent: '#8b5cf6',
      accentHover: '#7c3aed',
      accentMedium: 'rgba(139, 92, 246, 0.35)',
      accentLight: 'rgba(139, 92, 246, 0.1)',
      accentLighter: 'rgba(139, 92, 246, 0.05)',
      borderColor: '#e5e7eb',
      borderLight: '#f3f4f6',
      borderLighter: '#f9fafb',
      borderInput: '#d1d5db',
      scrollbarTrack: '#f5f3ff',
      scrollbarThumb: '#c4b5fd',
      scrollbarThumbHover: '#a78bfa',
      colorSuccess: '#10b981',
      colorError: '#ef4444',
    },
  },

  // 4. Dark Mode - Modern & Eye-friendly
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Easy on the eyes',
    icon: '🌙',
    colors: {
      bgApp: '#0f172a',
      bgPanel: '#1e293b',
      bgMuted: '#334155',
      bgSidebar: '#020617',
      bgSidebarAccent: '#0f172a',
      bgHover: '#334155',
      bgSelected: '#475569',
      textPrimary: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textTertiary: '#94a3b8',
      textInvert: '#0f172a',
      accent: '#3b82f6',
      accentHover: '#2563eb',
      accentMedium: 'rgba(59, 130, 246, 0.4)',
      accentLight: 'rgba(59, 130, 246, 0.2)',
      accentLighter: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#334155',
      borderLight: '#475569',
      borderLighter: '#64748b',
      borderInput: '#475569',
      scrollbarTrack: '#1e293b',
      scrollbarThumb: '#475569',
      scrollbarThumbHover: '#64748b',
      colorSuccess: '#10b981',
      colorError: '#ef4444',
    },
  },
];

export const defaultTheme = themes[0]; // Ocean Blue
