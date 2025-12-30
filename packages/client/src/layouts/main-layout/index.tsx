import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Space,
  Dropdown,
  Badge,
  Tooltip,
  Avatar,   
} from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../app/providers/AuthProvider";
import { logout } from "../../features/auth/services/auth.service";
import { showConfirmModal } from "../../components/confirm-modal";
import ThemeSwitcher from "../../components/theme-switcher";
import type { MenuProps } from "antd";
import "./styles.css";
import "./menu.css";

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
    <Layout style={{ height: "100vh", display: "flex", flexDirection: "row", background: "var(--bg-app)" }}>
      {/* Sidebar */}
      <Sider
        theme="dark"
        width={90}
        style={{
          background: "var(--bg-sidebar)",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        {/* Sidebar Content Wrapper - grows to fill space */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              padding: "16px 8px",
              textAlign: "center",
              borderBottom: "1px solid var(--bg-sidebar-accent)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.5px",
                marginBottom: 2,
              }}
            >
              GSM
            </div>
            <div
              style={{
                fontSize: 9,
                color: "white",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              CRM SYSTEM
            </div>
          </div>

          {/* Navigation Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={(e) => handleMenuClick(e.key)}
            style={{
              background: "var(--bg-sidebar)",
              border: "none",
              marginTop: 12,
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: 4,
            }}
          />

          {/* Sidebar Footer - Positioned at bottom */}
          <div
            style={{
              padding: "12px 8px",
              borderTop: "1px solid var(--bg-sidebar-accent)",
              textAlign: "center",
              fontSize: 9,
              color: "var(--text-secondary)",
              background: "var(--bg-sidebar-accent)",
              fontWeight: 500,
              marginTop: "auto",
            }}
          >
            © 2025 GMSS CRM
          </div>
        </div>
      </Sider>

      {/* Main Content Layout */}
      <Layout style={{ background: "var(--bg-app)", marginLeft: 90 }}>
        {/* Header */}
        <Header
          style={{
            background: "var(--bg-panel)",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "var(--shadow-subtle)",
            borderBottom: "1px solid var(--border-color)",
            gap: 24,
          }}
        >
          <div style={{ flex: 1 }} />

          {/* Right Side Actions */}
          <Space size={8} style={{ display: "flex", alignItems: "center", marginBottom: 0 }}>
            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Notifications */}
            <Tooltip title="Notifications">
              <Badge count={3} size="small" offset={[-2, 2]}>
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: 18 }} />}
                  style={{ 
                    color: "var(--text-secondary)",
                    width: 36,
                    height: 36,
                    padding: 0,
                    borderRadius: 8,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                />
              </Badge>
            </Tooltip>

            {/* User Menu */}
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <Space
                style={{
                  cursor: "pointer",
                  padding: "0 8px",
                  borderRadius: 8,
                  transition: "all 0.2s",
                  gap: 6,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Avatar
                  size={24}
                  style={{
                    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
                    fontSize: 13,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: "1",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.email || "User"}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content Area */}
        <Content
          style={{
            margin: 12,
            padding: 12,
            background: "var(--bg-panel)",
            borderRadius: 12,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            boxShadow: "var(--shadow-subtle)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
