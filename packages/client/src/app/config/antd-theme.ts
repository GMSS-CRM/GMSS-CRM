import type { ThemeConfig } from 'antd';

/**
 * Get CSS variable value from :root
 * This allows the Ant Design theme to dynamically sync with theme.css
 * Note: CSS variables are read on page load. Refresh the page after changing theme.css
 */
const getCssVar = (varName: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }
  return '';
};

/**
 * Dynamic CRM Theme Configuration
 * Automatically syncs with CSS variables from theme.css
 * Change theme.css and everything updates automatically!
 */
const antdTheme: ThemeConfig = {
  token: {
    // Primary Color - Reads from CSS variable
    colorPrimary: getCssVar('--accent') || '#0066cc',
    
    // Status Colors
    colorSuccess: getCssVar('--color-success') || '#52c41a',
    colorWarning: '#faad14',
    colorError: getCssVar('--color-error') || '#ff4d4f',
    colorInfo: getCssVar('--accent') || '#0066cc',
    
    // Text Colors - From theme.css
    colorTextBase: getCssVar('--text-primary') || '#262626',
    colorTextSecondary: getCssVar('--text-secondary') || '#8c8c8c',
    colorTextTertiary: getCssVar('--text-tertiary') || '#595959',
    colorTextQuaternary: getCssVar('--border-color') || '#d1d5db',
    
    // Background Colors - From theme.css
    colorBgBase: getCssVar('--bg-panel') || '#ffffff',
    colorBgContainer: getCssVar('--bg-muted') || '#f5f7ff',
    colorBgElevated: getCssVar('--bg-panel') || '#ffffff',
    colorBgLayout: getCssVar('--bg-app') || '#f5f7ff',
    
    // Border & Divider - From theme.css
    colorBorder: getCssVar('--border-color') || '#e8e8e8',
    colorBorderBg: getCssVar('--border-light') || '#f0f0f0',
    
    // Spacing & Sizing
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginMD: 16,
    marginLG: 24,
    marginXL: 32,
    
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingMD: 16,
    paddingLG: 24,
    paddingXL: 32,
    
    // Border Radius - From theme.css
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // Typography
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    lineHeight: 1.5714285714285714,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.35,
    lineHeightHeading3: 1.4,
    
    fontFamily: getCssVar('--font-sans') || `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif`,
    
    // Shadow - From theme.css
    boxShadow: getCssVar('--shadow-subtle') || '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    boxShadowSecondary: getCssVar('--shadow-sm') || '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  
  components: {
    // Layout Components
    Layout: {
      colorBgHeader: getCssVar('--bg-panel') || '#ffffff',
      colorBgBody: getCssVar('--bg-app') || '#f5f7ff',
      colorBgTrigger: getCssVar('--border-color') || '#e8e8e8',
      headerHeight: 64,
      headerPadding: '0 24px',
      headerColor: getCssVar('--text-primary') || '#262626',
      siderBg: getCssVar('--bg-sidebar') || '#071233',
    },
    
    // Menu - Sidebar navigation (Dynamic with theme.css)
    Menu: {
      colorItemBg: 'transparent',
      colorItemBgHover: 'rgba(255, 255, 255, 0.1)',
      colorItemBgSelected: getCssVar('--accent') || '#0066cc',
      colorItemBgSelectedHorizontal: getCssVar('--accent') || '#0066cc',
      colorItemText: '#d1d5db',
      colorItemTextHover: '#ffffff',
      colorItemTextSelected: '#ffffff',
      colorItemTextSelectedHorizontal: '#ffffff',
      itemBorderRadius: 6,
      itemMarginInline: 8,
      itemMarginBlock: 4,
      itemPaddingInline: 12,
    },
    
    // Button - Multiple variants
    Button: {
      controlHeight: 40,
      controlHeightLG: 44,
      controlHeightSM: 36,
      fontSize: 14,
      fontSizeLG: 16,
      borderRadius: 8,
      boxShadow: 'none',
      primaryColor: '#ffffff',
    },
    
    // Input Fields
    Input: {
      controlHeight: 40,
      controlHeightLG: 44,
      controlHeightSM: 36,
      fontSize: 14,
      borderRadius: 8,
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      colorBgContainer: '#ffffff',
      colorBorder: '#d1d5db',
    },
    
    // Card Components
    Card: {
      borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      padding: 24,
      paddingLG: 24,
      paddingMD: 16,
      paddingSM: 12,
    },
    
    // Table - Data display
    Table: {
      headerBg: '#f9fafb',
      headerColor: '#1f2937',
      borderRadius: 12,
      boxShadow: 'none',
      rowHoverBg: '#f3f4f6',
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
    },
    
    // Dropdown
    Dropdown: {
      borderRadius: 8,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    
    // Modal & Drawer
    Modal: {
      borderRadius: 12,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    
    Drawer: {
      borderRadius: 12,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    
    // Form
    Form: {
      labelColor: '#374151',
      labelFontSize: 14,
      labelHeight: 32,
      itemMarginBottom: 24,
    },
    
    // Statistic
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 32,
    },
    
    // Avatar
    Avatar: {
      controlHeight: 40,
      controlHeightLG: 56,
      controlHeightSM: 32,
      borderRadius: 50,
    },
    
    // Pagination
    Pagination: {
      controlHeight: 40,
      itemLinkBg: '#ffffff',
      itemActiveBg: '#0066cc',
    },
    
    // Badge
    Badge: {
      colorPrimary: '#0066cc',
    },
    
    // Tag
    Tag: {
      borderRadius: 6,
      fontSize: 12,
    },
  },
};

export default antdTheme;
