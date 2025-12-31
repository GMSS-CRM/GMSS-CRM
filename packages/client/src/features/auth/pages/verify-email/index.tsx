import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../../../../app/config/firebase";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, AppstoreOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

/**
 * Email Verification Handler
 * 
 * Handles email verification when users click the link from their email
 */
export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get("oobCode");

      if (!oobCode) {
        setStatus("error");
        setErrorMessage("Invalid verification link. Please try again.");
        return;
      }

      try {
        // Apply the verification code
        await applyActionCode(auth, oobCode);
        setStatus("success");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        
        // Handle different error codes
        if (error.code === "auth/invalid-action-code") {
          setErrorMessage("This verification link has expired or already been used.");
        } else if (error.code === "auth/user-disabled") {
          setErrorMessage("This account has been disabled.");
        } else {
          setErrorMessage("Failed to verify email. Please try again.");
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className={styles.verifyContainer}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <AppstoreOutlined />
          </div>
          <span className={styles.logoText}>GMSS CRM</span>
        </div>

        <div className={styles.statusContent}>
          {status === "loading" && (
            <>
              <LoadingOutlined style={{ fontSize: 64, color: "var(--accent)" }} />
              <h2 className={styles.title}>Verifying your email...</h2>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleOutlined style={{ fontSize: 64, color: "#52c41a" }} />
              <h2 className={styles.title}>Email Verified!</h2>
              <p className={styles.message}>
                Your email has been successfully verified. Redirecting to login...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <CloseCircleOutlined style={{ fontSize: 64, color: "#ff4d4f" }} />
              <h2 className={styles.title}>Verification Failed</h2>
              <p className={styles.message}>{errorMessage}</p>
              <button 
                className={styles.backButton}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
