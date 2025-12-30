import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingOutlined, AppstoreOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

/**
 * This component handles Firebase auth action URLs like:
 * /__/auth/action?mode=resetPassword&oobCode=xxx
 * and redirects to the appropriate page in our app
 */
export default function AuthActionHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    if (!mode || !oobCode) {
      navigate("/login");
      return;
    }

    // Handle different auth modes
    switch (mode) {
      case "resetPassword":
        // Redirect to our custom reset password page with the code
        navigate(`/reset-password?oobCode=${oobCode}`);
        break;
      case "verifyEmail":
        // Future: handle email verification
        navigate(`/verify-email?oobCode=${oobCode}`);
        break;
      default:
        navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className={styles.handlerContainer}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <AppstoreOutlined />
          </div>
          <span className={styles.logoText}>GMSS CRM</span>
        </div>
        <div className={styles.loadingContent}>
          <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} />
          <p className={styles.loadingText}>Redirecting...</p>
        </div>
      </div>
    </div>
  );
}
