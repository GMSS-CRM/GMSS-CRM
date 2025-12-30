import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Input,
  Space,
  Avatar,
  Dropdown,
  Badge,
  Tooltip,
  Divider,
} from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  SearchOutlined,
  DashboardOutlined,
  SafetyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAuth } from "../app/providers/AuthProvider";
import { logout } from "../features/auth/services/auth.service";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;

const menuItems: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined style={{ fontSize: 16 }} />,
    label: "Dashboard",
  },
  {
    key: "security",
    icon: <SafetyOutlined style={{ fontSize: 16 }} />,
    label: "Security",
  },
];

export default function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Get the current route to highlight the correct menu item
  const selectedKey = location.pathname.split("/")[1] || "dashboard";

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
      onClick: logout,
      danger: true,
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(`/${key}`);
  };

  return (
    <Layout style={{ height: "100vh", display: "flex", flexDirection: "row", background: "#f3f4f6" }}>
      {/* Sidebar */}
      <Sider
        theme="dark"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={280}
        collapsedWidth={80}
        style={{
          background: "#1f2937",
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
              padding: "20px 16px",
              textAlign: "center",
              borderBottom: "1px solid #374151",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: collapsed ? 18 : 20,
                fontWeight: 700,
                color: "#0066cc",
                letterSpacing: "0.5px",
                marginBottom: 4,
              }}
            >
              {collapsed ? "G" : "GMSS"}
            </div>
            {!collapsed && (
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontWeight: 500,
                  letterSpacing: "1px",
                }}
              >
                CRM SYSTEM
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={(e) => handleMenuClick(e.key)}
            style={{
              background: "#1f2937",
              border: "none",
              marginTop: 12,
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          />

          {/* Sidebar Footer - Positioned at bottom */}
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid #374151",
              textAlign: "center",
              fontSize: collapsed ? 9 : 11,
              color: "#9ca3af",
              background: "#111827",
              fontWeight: 500,
              marginTop: "auto",
            }}
          >
            © 2025 GMSS CRM
          </div>
        </div>
      </Sider>

      {/* Main Content Layout */}
      <Layout style={{ background: "#f3f4f6", marginLeft: collapsed ? 80 : 280, transition: "margin-left 0.2s" }}>
        {/* Header */}
        <Header
          style={{
            background: "#ffffff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
            borderBottom: "1px solid #e5e7eb",
            gap: 24,
          }}
        >
          {/* Toggle Button */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, color: "#6b7280" }}
          />

          {/* Search Bar */}
          <Input
            placeholder="Search users, roles, permissions..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            style={{
              maxWidth: 300,
              borderRadius: 8,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          />

          <div style={{ flex: 1 }} />

          {/* Right Side Actions */}
          <Space size={16} style={{ display: "flex", alignItems: "center" }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <Badge count={3} offset={[-8, 8]}>
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: 18, color: "#6b7280" }} />}
                  style={{ color: "#6b7280" }}
                />
              </Badge>
            </Tooltip>

            <Divider type="vertical" style={{ margin: 0, height: 24 }} />

            {/* User Menu */}
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <Space
                style={{
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: 8,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Avatar
                  style={{
                    backgroundColor: "#0066cc",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <span
                  style={{
                    fontSize: 14,
                    color: "#1f2937",
                    fontWeight: 500,
                    maxWidth: 120,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
            background: "#ffffff",
            borderRadius: 12,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
