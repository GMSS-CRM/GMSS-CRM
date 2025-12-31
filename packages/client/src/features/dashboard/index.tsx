import { RocketOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <RocketOutlined className={styles.icon} />
        </div>
        <h1 className={styles.title}>Dashboard Coming Soon</h1>
        <p className={styles.description}>
          We're building something amazing! Our comprehensive dashboard with real-time analytics, 
          insights, and performance metrics will be available soon.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>📊 Real-time Analytics</div>
          <div className={styles.feature}>📈 Performance Metrics</div>
          <div className={styles.feature}>🎯 Custom Reports</div>
        </div>
      </div>
    </div>
  );
}

