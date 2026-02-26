import { ConfigProvider } from "antd";
import { useMemo } from "react";
import AppRoutes from "./app/routes/AppRoutes";
import MobileBlocker from "./components/mobile-blocker";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { useTheme } from "./app/providers/ThemeProvider";

// Dynamic Ant Design Theme that reads current CSS variables
function ThemedApp() {
  const { currentTheme } = useTheme();
  
  const antdTheme = useMemo(() => ({
    token: {
      // Colors
      colorPrimary: currentTheme.colors.accent,
      colorSuccess: currentTheme.colors.colorSuccess,
      colorWarning: '#faad14',
      colorError: currentTheme.colors.colorError,
      colorInfo: currentTheme.colors.accent,
      colorTextBase: currentTheme.colors.textPrimary,
      colorTextSecondary: currentTheme.colors.textSecondary,
      colorTextTertiary: currentTheme.colors.textTertiary,
      colorBgBase: currentTheme.colors.bgPanel,
      colorBgContainer: currentTheme.colors.bgPanel,
      colorBgLayout: currentTheme.colors.bgApp,
      colorBorder: currentTheme.colors.borderColor,
      
      // Modern compact sizing
      fontSize: 13,
      fontSizeLG: 14,
      fontSizeSM: 12,
      fontSizeHeading1: 28,
      fontSizeHeading2: 22,
      fontSizeHeading3: 18,
      fontSizeHeading4: 15,
      fontSizeHeading5: 13,
      
      // Tighter spacing
      padding: 12,
      paddingXS: 6,
      paddingSM: 10,
      paddingLG: 16,
      margin: 12,
      marginXS: 6,
      marginSM: 10,
      marginLG: 16,
      
      // Border radius
      borderRadius: 8,
      borderRadiusLG: 10,
      borderRadiusSM: 6,
      borderRadiusXS: 4,
      
      // Line height
      lineHeight: 1.5,
      lineHeightLG: 1.6,
      lineHeightSM: 1.4,
      
      // Control heights (compact)
      controlHeight: 36,
      controlHeightLG: 40,
      controlHeightSM: 28,
    },
    components: {
      Menu: {
        colorItemBg: 'transparent',
        colorItemBgHover: 'rgba(255, 255, 255, 0.1)',
        colorItemBgSelected: currentTheme.colors.accent,
        colorItemText: '#d1d5db',
        colorItemTextHover: '#ffffff',
        colorItemTextSelected: '#ffffff',
        itemBorderRadius: 8,
        fontSize: 11,
        itemHeight: 70,
        itemPaddingInline: 8,
        iconSize: 22,
        iconMarginInlineEnd: 0,
      },
      Button: {
        controlHeight: 36,
        controlHeightLG: 40,
        controlHeightSM: 28,
        fontSize: 13,
        fontSizeLG: 14,
        fontSizeSM: 12,
        borderRadius: 8,
        paddingContentHorizontal: 14,
        colorTextDisabled: 'rgba(0, 0, 0, 0.45)',
        colorBgContainerDisabled: 'rgba(0, 0, 0, 0.04)',
      },
      Input: {
        controlHeight: 36,
        controlHeightLG: 40,
        controlHeightSM: 28,
        fontSize: 13,
        borderRadius: 8,
        paddingBlock: 6,
        paddingInline: 12,
        colorBgContainer: currentTheme.colors.bgPanel,
      },
      Select: {
        controlHeight: 36,
        controlHeightLG: 40,
        controlHeightSM: 28,
        fontSize: 13,
        borderRadius: 8,
        colorBgContainer: currentTheme.colors.bgPanel,
      },
      Card: {
        borderRadius: 10,
        padding: 16,
        paddingLG: 20,
        paddingSM: 12,
        fontSize: 13,
      },
      Table: {
        fontSize: 13,
        cellPaddingBlock: 10,
        cellPaddingInline: 12,
        headerBg: currentTheme.colors.bgMuted,
      },
      Form: {
        labelFontSize: 13,
        itemMarginBottom: 16,
        verticalLabelPadding: '0 0 4px',
      },
      Typography: {
        fontSize: 13,
        fontSizeHeading1: 28,
        fontSizeHeading2: 22,
        fontSizeHeading3: 18,
        fontSizeHeading4: 15,
        fontSizeHeading5: 13,
      },
      List: {
        fontSize: 13,
      },
      Avatar: {
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
        fontSize: 13,
        fontSizeLG: 16,
        fontSizeSM: 11,
      },
      Dropdown: {
        fontSize: 13,
        borderRadius: 8,
        controlItemBgHover: currentTheme.colors.bgHover,
        controlItemBgActive: currentTheme.colors.accentLight,
        colorText: currentTheme.colors.textPrimary,
        colorTextDisabled: currentTheme.colors.textTertiary,
        colorError: currentTheme.colors.colorError,
        colorErrorHover: '#ff7875',
        colorErrorBg: 'rgba(255, 77, 79, 0.1)',
      },
      Modal: {
        fontSize: 13,
        borderRadius: 10,
        titleFontSize: 15,
      },
      Drawer: {
        fontSize: 13,
        borderRadius: 10,
      },
      Badge: {
        fontSize: 11,
        fontSizeSM: 10,
      },
      Tag: {
        fontSize: 12,
        borderRadius: 6,
      },
    },
  }), [currentTheme]);

  return (
    <ConfigProvider theme={antdTheme}>
      <MobileBlocker>
        <AppRoutes />
      </MobileBlocker>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
