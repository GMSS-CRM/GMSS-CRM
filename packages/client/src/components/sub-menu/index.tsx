import { Menu, Divider } from 'antd';
import { UserOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './styles.module.css';

export type SubMenuItem = 'users' | 'roles' | 'permissions';

interface SubMenuProps {
  selectedMenu: SubMenuItem;
  onMenuChange: (key: SubMenuItem) => void;
}

export default function SubMenu({ selectedMenu, onMenuChange }: SubMenuProps) {
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
