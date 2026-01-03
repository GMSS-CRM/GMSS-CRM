import { Menu, Divider, Tag } from 'antd';
import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type SubMenuItem = string;

export interface SubMenuItemConfig {
  key: string;
  icon: ReactNode;
  label: string;
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
    icon: item.icon,
    label: item.label,
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
