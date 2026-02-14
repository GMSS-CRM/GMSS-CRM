// packages/client/src/features/tags/pages/DeleteTagModal.tsx
import { Modal } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { TagWithVendorCount } from '../types/tagTypes';
import styles from '../styles/tags.module.css';

interface DeleteTagModalProps {
  open: boolean;
  tag: TagWithVendorCount | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteTagModal({
  open,
  tag,
  onCancel,
  onConfirm,
}: DeleteTagModalProps) {
  if (!tag) return null;

  return (
    <Modal
      title={
        <span className={`${styles.modalTitle} ${styles.dangerModalTitle}`}>
          <ExclamationCircleOutlined className={styles.dangerIcon} />
          Delete Tag
        </span>
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      okButtonProps={{ danger: true }}
      destroyOnClose
    >
      <div style={{ padding: '8px 0' }}>
        <p style={{ marginBottom: 16 }}>
          Are you sure you want to delete the tag{' '}
          <span className={styles.deleteTagName}>"{tag.name}"</span>?
        </p>
        
        {(tag.vendorCount > 0 || tag.tenderCount > 0) && (
          <div className={styles.warningBox}>
            <WarningOutlined className={styles.warningIcon} />
            <span className={styles.warningText}>
              This tag is currently assigned to{' '}
              <strong>{tag.tenderCount} tenders</strong> and{' '}
              <strong>{tag.vendorCount} vendors</strong>. 
              Deleting it will remove all associations.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}