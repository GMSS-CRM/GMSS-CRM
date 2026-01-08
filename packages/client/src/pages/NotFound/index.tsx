import { useNavigate } from "react-router-dom";
import { FileSearchOutlined } from "@ant-design/icons";
import Button from "../../components/button";
import styles from "./styles.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <FileSearchOutlined className={styles.icon} />
        </div>
        
        <div className={styles.errorCode}>404</div>
        
        <h1 className={styles.title}>Page Not Found</h1>
        
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to a safe place.
        </p>

        <div className={styles.actions}>
          <Button 
            variant="primary"
            size="large"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
