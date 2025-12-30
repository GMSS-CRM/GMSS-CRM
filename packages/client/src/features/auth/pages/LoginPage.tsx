import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Spin,
  Space,
  Divider,
  Row,
  Col,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  SmileOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import { loginWithEmailPassword } from "../services/auth.service";
import { useAuth } from "../../../app/providers/AuthProvider";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form] = Form.useForm();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      await loginWithEmailPassword(values.email, values.password);
      message.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      message.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Spin size="large" tip="Checking authentication..." />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <Row gutter={[32, 32]} style={{ width: "100%", maxWidth: "900px" }}>
        {/* Left Side - Features/Info */}
        <Col xs={24} sm={24} md={12} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                marginBottom: 16,
                letterSpacing: "-1px",
              }}
            >
              GMSS CRM
            </div>
            <p
              style={{
                fontSize: 18,
                marginBottom: 32,
                opacity: 0.9,
                lineHeight: 1.6,
              }}
            >
              Manage your business relationships effectively with our modern CRM platform
            </p>

            {/* Features */}
            <Space
              direction="vertical"
              size={16}
              style={{
                textAlign: "left",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <SmileOutlined style={{ fontSize: 24, color: "#fbbf24" }} />
                <div>
                  <strong style={{ fontSize: 16 }}>User Friendly</strong>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
                    Intuitive interface designed for ease of use
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <SecurityScanOutlined style={{ fontSize: 24, color: "#fbbf24" }} />
                <div>
                  <strong style={{ fontSize: 16 }}>Secure</strong>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
                    Enterprise-grade security for your data
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <SecurityScanOutlined style={{ fontSize: 24, color: "#fbbf24" }} />
                <div>
                  <strong style={{ fontSize: 16 }}>Powerful</strong>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: 14 }}>
                    Advanced features for growing businesses
                  </p>
                </div>
              </div>
            </Space>
          </div>
        </Col>

        {/* Right Side - Login Form */}
        <Col xs={24} sm={24} md={12}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
              padding: 32,
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1f2937",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                Welcome Back
              </h2>
              <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
              requiredMark={false}
            >
              <Form.Item
                label={<span style={{ fontWeight: 500, color: "#374151" }}>Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: "Please enter your email address" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
                  placeholder="name@example.com"
                  size="large"
                  style={{
                    borderRadius: 8,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500, color: "#374151" }}>Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
                  placeholder="Enter your password"
                  size="large"
                  style={{
                    borderRadius: 8,
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    height: 44,
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ margin: "24px 0" }} />

            {/* Demo Info */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: 8,
                padding: 12,
                textAlign: "center",
                fontSize: 12,
                color: "#16a34a",
              }}
            >
              <strong>Demo Mode:</strong> Use any email and password to login
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
