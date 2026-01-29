 
import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { TagWithVendorCount } from '../types/tagTypes';
import styles from '../styles/tags.module.css';

const { Text } = Typography;

interface DeleteTagModalProps {
  open: boolean;
  onClose: () => void;
  tag: TagWithVendorCount | null;
  onConfirm: () => Promise<boolean>;
  loading?: boolean;
}

export default function DeleteTagModal({
  open,
  onClose,
  tag,
  onConfirm,
  loading,
}: DeleteTagModalProps) {
  const handleDelete = async () => {
    const success = await onConfirm();
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleDelete}
      confirmLoading={loading}
      title={
        <div className={`${styles.modalTitle} ${styles.dangerModalTitle}`}>
          <ExclamationCircleOutlined className={styles.dangerIcon} />
          Delete Tag
        </div>
      }
      okText="Delete"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
      width={440}
    >
      <div style={{ marginTop: 8 }}>
        <Text>
          Are you sure you want to delete the tag{' '}
          <span className={styles.deleteTagName}>"{tag?.name}"</span>?
        </Text>

        {tag && tag.vendorCount > 0 && (
          <div className={styles.warningBox}>
            <WarningOutlined className={styles.warningIcon} />
            <span className={styles.warningText}>
              This tag is assigned to <strong>{tag.vendorCount}</strong> vendor
              {tag.vendorCount > 1 ? 's' : ''}. Deleting it will remove the tag
              from all associated vendors.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
