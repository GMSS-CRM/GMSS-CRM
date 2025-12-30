import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { 
  LockOutlined, 
  AppstoreOutlined, 
  CheckCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { verifyResetCode, confirmNewPassword } from "../../services/auth.service";
import styles from "./styles.module.css";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!oobCode) {
      message.error("Invalid or missing reset code");
      navigate("/login");
      return;
    }

    // Verify the reset code
    const verifyCode = async () => {
      try {
        const userEmail = await verifyResetCode(oobCode);
        setEmail(userEmail);
        setVerifying(false);
      } catch (error: any) {
        message.error(error.message || "Invalid or expired reset link");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    verifyCode();
  }, [oobCode, navigate]);

  const handleResetPassword = async (values: { password: string }) => {
    if (!oobCode) return;

    try {
      setLoading(true);
      await confirmNewPassword(oobCode, values.password);
      setSuccess(true);
      message.success("Password reset successfully!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      message.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className={styles.resetContainer}>
        <div className={styles.centerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <AppstoreOutlined />
            </div>
            <span className={styles.logoText}>GMSS CRM</span>
          </div>
          <div className={styles.verifyingContent}>
            <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} />
            <p className={styles.verifyingText}>Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.resetContainer}>
        <div className={styles.centerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <AppstoreOutlined />
            </div>
            <span className={styles.logoText}>GMSS CRM</span>
          </div>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <CheckCircleOutlined />
            </div>
            <h2 className={styles.successTitle}>Password Reset Successful!</h2>
            <p className={styles.successDescription}>
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <p className={styles.redirectText}>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resetContainer}>
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
            Set your new password
          </h1>
          
          <p className={styles.description}>
            Choose a strong password to keep your account secure.
          </p>

          <div className={styles.securityTips}>
            <h3 className={styles.tipsTitle}>Password Guidelines:</h3>
            <ul className={styles.tipsList}>
              <li>At least 6 characters long</li>
              <li>Use a mix of letters and numbers</li>
              <li>Avoid common words or patterns</li>
              <li>Don't reuse old passwords</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Reset Password</h2>
              <p className={styles.formSubtitle}>
                Enter a new password for <strong>{email}</strong>
              </p>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleResetPassword}
              autoComplete="off"
              requiredMark={false}
            >
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#8c8c8c", fontSize: "14px" }} />}
                  placeholder="New password"
                  size="large"
                  style={{
                    borderRadius: 8,
                    height: 44,
                    fontSize: 14,
                  }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#8c8c8c", fontSize: "14px" }} />}
                  placeholder="Confirm new password"
                  size="large"
                  style={{
                    borderRadius: 8,
                    height: 44,
                    fontSize: 14,
                  }}
                />
              </Form.Item>

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
                  Reset Password
                </Button>
              </Form.Item>
            </Form>

            <div className={styles.backToLogin}>
              <button
                type="button"
                className={styles.backLink}
                onClick={() => navigate("/login")}
              >
                ← Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
