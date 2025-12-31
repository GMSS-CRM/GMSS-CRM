import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Space,
  Dropdown,
  Avatar,   
} from "antd";
import {
  LogoutOutlined,
  DashboardOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../app/providers/AuthProvider";
import { logout } from "../../features/auth/services/auth.service";
import { showConfirmModal } from "../../components/confirm-modal";
import ThemeSwitcher from "../../components/theme-switcher";
import NotificationDropdown from "../../components/notifications";
import type { MenuProps } from "antd";
import styles from "./styles.module.css";

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined style={{ fontSize: 22 }} />,
    label: "Dashboard",
  },
  {
    key: "security",
    icon: <SafetyOutlined style={{ fontSize: 22 }} />,
    label: "Security",
  },
];

export default function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current route to highlight the correct menu item
  const selectedKey = location.pathname.split("/")[1] || "dashboard";

  const handleLogout = () => {
    showConfirmModal({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Logout',
      okType: 'danger',
      onOk: logout,
    });
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "My Profile",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(`/${key}`);
  };

  return (
    <Layout className={styles.layout}>
      {/* Sidebar */}
      <Sider theme="dark" width={90} className={styles.sider}>
        {/* Sidebar Content Wrapper */}
        <div className={styles.sidebarContent}>
          {/* Logo Section */}
          <div className={styles.logo}>
            <div className={styles.logoTitle}>GMSS</div>
            <div className={styles.logoSubtitle}>CRM SYSTEM</div>
          </div>

          {/* Navigation Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={(e) => handleMenuClick(e.key)}
            className={styles.menu}
          />

          {/* Sidebar Footer */}
          <div className={styles.sidebarFooter}>
            © 2025 GMSS CRM
          </div>
        </div>
      </Sider>

      {/* Main Content Layout */}
      <Layout className={styles.mainContent}>
        {/* Header */}
        <Header className={styles.header}>
          <div className={styles.headerSpacer} />

          {/* Right Side Actions */}
          <Space size={16} className={styles.headerActions}>
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Notifications */}
            <NotificationDropdown />

            {/* User Menu */}
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <Space className={styles.userDropdown}>
                <Avatar size={24} className={styles.userAvatar}>
                  {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <span className={styles.userName}>
                  {user?.email || "User"}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content Area */}
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
