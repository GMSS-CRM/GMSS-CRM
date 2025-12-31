import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingOutlined, AppstoreOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

/**
 * Email Action Handler
 * 
 * Processes Firebase authentication email action links:
 * - Password reset links from email
 * - Email verification links
 * - Account recovery links
 * 
 * Example URL: /auth/action?mode=resetPassword&oobCode=ABC123
 */
export default function EmailHandler() {
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
          <LoadingOutlined style={{ fontSize: 48, color: "var(--accent)" }} />
          <p className={styles.loadingText}>Redirecting...</p>
        </div>
      </div>
    </div>
  );
}
