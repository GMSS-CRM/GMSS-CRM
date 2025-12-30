import { useEffect, useState } from "react";
import { AppstoreOutlined, DesktopOutlined, TabletOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

const MOBILE_BREAKPOINT = 768;

export default function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <AppstoreOutlined className={styles.logoIcon} />
          <h1 className={styles.logoText}>GMSS CRM</h1>
        </div>

        <div className={styles.devicesIcon}>
          <DesktopOutlined />
          <TabletOutlined />
        </div>

        <h2 className={styles.title}>Desktop Experience Required</h2>
        
        <p className={styles.description}>
          GMSS CRM is optimized for desktop and tablet devices to provide you with 
          the best experience for managing your business operations.
        </p>

        <div className={styles.requirements}>
          <h3 className={styles.requirementsTitle}>Recommended Devices:</h3>
          <ul className={styles.requirementsList}>
            <li>💻 Desktop Computer (Windows, Mac, Linux)</li>
            <li>💼 Laptop (13" or larger)</li>
            <li>📱 Tablet (iPad, Android tablet in landscape)</li>
          </ul>
        </div>

        <div className={styles.tip}>
          <p className={styles.tipText}>
            <strong>Tip:</strong> Rotate your tablet to landscape mode or access from a larger device.
          </p>
        </div>

        <p className={styles.footer}>
          We're working on a mobile app for on-the-go access. Stay tuned!
        </p>
      </div>
    </div>
  );
}
