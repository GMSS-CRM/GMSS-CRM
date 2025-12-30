import { Card, Row, Col, Statistic, Table, Space, Button, Tag, Progress } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  LineChartOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

export default function DashboardPage() {
  // Sample data for recent users
  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text: number) => (
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0066cc" }}>
          #{text}
        </span>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: "#1f2937" }}>{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text: string) => <span style={{ color: "#6b7280" }}>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const color = status === "Active" ? "success" : "default";
        return (
          <Tag color={color} style={{ borderRadius: 4, padding: "4px 12px" }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
      width: 120,
      render: (text: string) => <span style={{ color: "#6b7280" }}>{text}</span>,
    },
  ];

  const tableData = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      status: "Active",
      joined: "Jan 15, 2025",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Active",
      joined: "Jan 12, 2025",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      status: "Active",
      joined: "Jan 10, 2025",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice.williams@example.com",
      status: "Inactive",
      joined: "Jan 08, 2025",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1f2937",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#6b7280",
              margin: "4px 0 0 0",
              fontWeight: 400,
            }}
          >
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <Space>
          <Button type="default" icon={<DownloadOutlined />}>
            Export
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Add User
          </Button>
        </Space>
      </div>

      {/* Stats Row */}
      <Row gutter={[16, 16]}>
        {/* Total Users Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              height: "100%",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  Total Users
                </span>
              }
              value={1234}
              prefix={
                <UserOutlined
                  style={{
                    color: "#0066cc",
                    marginRight: 8,
                    fontSize: 18,
                  }}
                />
              }
              valueStyle={{
                color: "#1f2937",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#10b981",
                fontWeight: 500,
              }}
            >
              +12% from last month
            </div>
          </Card>
        </Col>

        {/* Active Roles Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              height: "100%",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  Active Roles
                </span>
              }
              value={8}
              prefix={
                <TeamOutlined
                  style={{
                    color: "#8b5cf6",
                    marginRight: 8,
                    fontSize: 18,
                  }}
                />
              }
              valueStyle={{
                color: "#1f2937",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              Configured
            </div>
          </Card>
        </Col>

        {/* Total Permissions Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              height: "100%",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  Permissions
                </span>
              }
              value={32}
              prefix={
                <SafetyOutlined
                  style={{
                    color: "#f59e0b",
                    marginRight: 8,
                    fontSize: 18,
                  }}
                />
              }
              valueStyle={{
                color: "#1f2937",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              All modules
            </div>
          </Card>
        </Col>

        {/* Active Sessions Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              height: "100%",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={
                <span
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: 500,
                  }}
                >
                  Active Sessions
                </span>
              }
              value={456}
              prefix={
                <LineChartOutlined
                  style={{
                    color: "#10b981",
                    marginRight: 8,
                    fontSize: 18,
                  }}
                />
              }
              valueStyle={{
                color: "#1f2937",
                fontSize: 28,
                fontWeight: 700,
              }}
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#10b981",
                fontWeight: 500,
              }}
            >
              Online now
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Users Table */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              Recent Users
            </span>
            <Tag
              color="blue"
              style={{
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: 12,
              }}
            >
              {tableData.length} users
            </Tag>
          </div>
        }
        extra={
          <Button type="link" size="small" style={{ color: "#0066cc" }}>
            View All →
          </Button>
        }
        style={{
          borderRadius: 12,
          border: "1px solid #e5e7eb",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        <Table
          columns={columns}
          dataSource={tableData.map((item, index) => ({
            ...item,
            key: index,
          }))}
          pagination={false}
          size="middle"
          style={{ overflowX: "auto" }}
        />
      </Card>

      {/* System Health Section */}
      <Row gutter={[16, 16]}>
        {/* Database Status */}
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                Database Status
              </span>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                }}
              />
              <span style={{ color: "#1f2937", fontWeight: 500 }}>
                All systems operational
              </span>
            </div>
            <Progress
              percent={100}
              showInfo={false}
              style={{ marginTop: 12 }}
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              Latest update: 2 minutes ago
            </div>
          </Card>
        </Col>

        {/* Backup Status */}
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                Last Backup
              </span>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#0066cc",
                }}
              />
              <span style={{ color: "#1f2937", fontWeight: 500 }}>
                Completed
              </span>
            </div>
            <div
              style={{
                marginTop: 16,
                fontSize: 16,
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              2 hours ago
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              2.4 GB backed up
            </div>
          </Card>
        </Col>

        {/* API Health */}
        <Col xs={24} sm={12} md={8}>
          <Card
            title={
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1f2937",
                }}
              >
                API Health
              </span>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                }}
              />
              <span style={{ color: "#1f2937", fontWeight: 500 }}>
                Healthy
              </span>
            </div>
            <div
              style={{
                marginTop: 16,
                fontSize: 16,
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              99.9% Uptime
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              No errors detected
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
