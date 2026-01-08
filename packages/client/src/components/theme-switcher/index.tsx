import { Dropdown } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useTheme } from '../../app/providers/ThemeProvider';
import type { MenuProps } from 'antd';
import Button from '../button';
import styles from './styles.module.css';

/**
 * Theme Switcher Component
 * Allows users to switch between pre-defined color themes
 * - Displays current theme with icon
 * - Shows all available themes in dropdown
 * - Instantly applies theme changes across the entire app
 * - Persists user preference to localStorage
 */
export default function ThemeSwitcher() {
  const { currentTheme, setTheme, themes } = useTheme();

  const menuItems: MenuProps['items'] = themes.map((theme: any) => ({
    key: theme.id,
    label: (
      <div className={styles.themeOption}>
        <div className={styles.themeInfo}>
          <span className={styles.themeIcon}>{theme.icon}</span>
          <div className={styles.themeDetails}>
            <div className={styles.themeName}>{theme.name}</div>
          </div>
        </div>
        {currentTheme.id === theme.id && (
          <CheckOutlined className={styles.checkIcon} />
        )}
      </div>
    ),
    onClick: () => setTheme(theme.id),
    className: currentTheme.id === theme.id ? styles.activeTheme : '',
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName={styles.themeDropdown}
    >
      <Button
        variant="text"
        className={styles.themeSwitcherButton}
      >
        <span className={styles.currentThemeIcon}>{currentTheme.icon}</span>
      </Button>
    </Dropdown>
  );
}
