import { Menu, Divider } from 'antd';
import { UserOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { SecurityMenuItem } from '../types';
import styles from './SecurityMenu.module.css';

interface SecurityMenuProps {
  selectedMenu: SecurityMenuItem;
  onMenuChange: (key: SecurityMenuItem) => void;
}

export default function SecurityMenu({ selectedMenu, onMenuChange }: SecurityMenuProps) {
  const menuItems: MenuProps['items'] = [
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: 'roles',
      icon: <TeamOutlined />,
      label: 'Roles',
    },
    {
      key: 'permissions',
      icon: <LockOutlined />,
      label: 'Permissions',
    },
  ];

  return (
    <div className={styles.menu}>
      <div className={styles.title}>Security</div>
      <Divider style={{ margin: '8px 0' }} />
      <Menu
        mode="vertical"
        selectedKeys={[selectedMenu]}
        items={menuItems}
        onClick={(e) => onMenuChange(e.key as SecurityMenuItem)}
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: 14,
        }}
      />
    </div>
  );
}
