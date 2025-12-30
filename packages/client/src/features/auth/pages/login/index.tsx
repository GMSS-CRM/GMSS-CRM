import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Form, Input, Button, message, Modal } from "antd";
import { 
  LockOutlined, 
  MailOutlined, 
  AppstoreOutlined, 
  KeyOutlined, 
  CheckCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  RocketOutlined
} from "@ant-design/icons";
import { loginWithEmailPassword, resetPassword } from "../../services/auth.service";
import { useAuth } from "../../../../app/providers/AuthProvider";
import Loader from "../../../../components/loader";
import styles from "./styles.module.css";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();

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

  const handleForgotPassword = () => {
    setResetModalVisible(true);
    setResetSuccess(false);
    resetForm.resetFields();
  };

  const handleResetPassword = async (values: { email: string }) => {
    try {
      setResetLoading(true);
      await resetPassword(values.email);
      setResetSuccess(true);
    } catch (err: any) {
      message.error(err.message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  const handleCloseResetModal = () => {
    setResetModalVisible(false);
    setResetSuccess(false);
    resetForm.resetFields();
  };

  if (authLoading) {
    return <Loader />;
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className={styles.loginContainer}>
      {/* Left Panel - Branding */}
      <div className={styles.leftPanel}>
        <div className={styles.decorativePattern}></div>
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <AppstoreOutlined />
            </div>
            <span className={styles.logoText}>GMSS CRM</span>
          </div>
          
          <h1 className={styles.tagline}>
            Transform how you manage customer relationships
          </h1>
          
          <p className={styles.description}>
            Powerful CRM built for modern teams. Boost productivity and grow with confidence.
          </p>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ThunderboltOutlined />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Lightning Fast</h3>
                <p className={styles.featureDescription}>
                  Optimized performance for seamless user experience
                </p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <SafetyOutlined />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Enterprise Security</h3>
                <p className={styles.featureDescription}>
                  Bank-level encryption to keep your data protected
                </p>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <RocketOutlined />
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>Scale with Ease</h3>
                <p className={styles.featureDescription}>
                  Built to grow alongside your business needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Welcome Back</h2>
              <p className={styles.formSubtitle}>Enter your credentials to access your account</p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "var(--text-secondary)", fontSize: "14px" }} />}
                  placeholder="Email address"
                  size="large"
                  style={{
                    borderRadius: 8,
                    height: 44,
                    fontSize: 14,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "var(--text-secondary)", fontSize: "14px" }} />}
                  placeholder="Password"
                  size="large"
                  style={{
                    borderRadius: 8,
                    height: 44,
                    fontSize: 14,
                  }}
                />
              </Form.Item>

              <div className={styles.formActions}>
                <div></div>
                <button
                  type="button"
                  className={styles.forgotPassword}
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <Form.Item className={styles.submitButton}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    borderRadius: 8,
                    height: 44,
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </Button>
              </Form.Item>
            </Form>

            <div className={styles.demoInfo}>
              <p className={styles.demoText}>
                <span className={styles.demoStrong}>Email:</span> demo@demo.com
              </p>
              <p className={styles.demoText}>
                <span className={styles.demoStrong}>Pass:</span> demo1234
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <Modal
        open={resetModalVisible}
        onCancel={handleCloseResetModal}
        footer={null}
        width={480}
        centered
        destroyOnClose
      >
        <div className={styles.resetModal}>
          <div className={styles.resetIcon}>
            <KeyOutlined />
          </div>

          {!resetSuccess ? (
            <>
              <h2 className={styles.resetTitle}>Reset your password</h2>
              <p className={styles.resetDescription}>
                Enter your email address and we'll send you a link to reset your password
              </p>

              <Form
                form={resetForm}
                layout="vertical"
                onFinish={handleResetPassword}
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: "var(--text-secondary)", fontSize: "14px" }} />}
                    placeholder="Enter your email"
                    size="large"
                    style={{
                      borderRadius: 8,
                      height: 44,
                      fontSize: 14,
                    }}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={resetLoading}
                    block
                    size="large"
                    style={{
                      borderRadius: 8,
                      height: 44,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Send reset link
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <>
              <h2 className={styles.resetTitle}>Check your email</h2>
              <p className={styles.resetDescription}>
                We've sent a password reset link to your email address
              </p>

              <div className={styles.resetSuccess}>
                <p className={styles.resetSuccessText}>
                  <CheckCircleOutlined style={{ fontSize: "18px" }} />
                  Reset link sent successfully!
                </p>
              </div>

              <Button
                type="primary"
                block
                size="large"
                onClick={handleCloseResetModal}
                style={{
                  marginTop: "1.5rem",
                  borderRadius: 8,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Done
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
