import { Menu, Divider, Tag, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';
import { LockOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

export type SubMenuItem = string;

export interface SubMenuItemConfig {
  key: string;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface SubMenuProps {
  title: string;
  selectedMenu: SubMenuItem;
  onMenuChange: (key: SubMenuItem) => void;
  items: SubMenuItemConfig[];
  badge?: {
    text: string;
    color?: string;
  };
}

export default function SubMenu({ 
  title, 
  selectedMenu, 
  onMenuChange, 
  items,
  badge 
}: SubMenuProps) {
  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.key,
    icon: item.disabled ? (
      <Tooltip title={item.disabledReason ?? 'Not available'} placement="right">
        <LockOutlined style={{ opacity: 0.4 }} />
      </Tooltip>
    ) : item.icon,
    label: item.disabled ? (
      <Tooltip title={item.disabledReason ?? 'Not available'} placement="right">
        <span style={{ opacity: 0.4 }}>{item.label}</span>
      </Tooltip>
    ) : item.label,
    disabled: item.disabled,
  }));

  return (
    <div className={styles.menu}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {badge && (
          <Tag color={badge.color || 'default'} className={styles.badge}>
            {badge.text}
          </Tag>
        )}
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <Menu
        mode="vertical"
        selectedKeys={[selectedMenu]}
        items={menuItems}
        onClick={(e) => onMenuChange(e.key as SubMenuItem)}
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: 14,
        }}
      />
    </div>
  );
}
