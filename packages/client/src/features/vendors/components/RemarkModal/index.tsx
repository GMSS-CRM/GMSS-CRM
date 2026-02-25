import { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface RemarkModalProps {
  open: boolean;
  title: string;
  description?: string;
  required?: boolean;
  onConfirm: (remark: string) => void;
  onCancel: () => void;
  confirmLoading?: boolean;
}

/**
 * Reusable remark popup.
 * Used for: direct status-change saves, Send to MD, and MD Resolve actions.
 */
export default function RemarkModal({
  open,
  title,
  description,
  required = true,
  onConfirm,
  onCancel,
  confirmLoading = false,
}: RemarkModalProps) {
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');

  // Reset on open/close
  useEffect(() => {
    if (!open) {
      setRemark('');
      setError('');
    }
  }, [open]);

  const handleOk = () => {
    if (required && !remark.trim()) {
      setError('Please provide a remark before proceeding.');
      return;
    }
    setError('');
    onConfirm(remark.trim());
  };

  return (
    <Modal
      open={open}
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageOutlined style={{ color: '#2563eb' }} />
          {title}
        </span>
      }
      onOk={handleOk}
      onCancel={onCancel}
      okText="Confirm"
      cancelText="Cancel"
      confirmLoading={confirmLoading}
      centered
      destroyOnHidden
      width={480}
      styles={{
        body: { paddingTop: 8 },
      }}
    >
      {description && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary, #6b7280)', marginBottom: 12 }}>
          {description}
        </p>
      )}
      <TextArea
        placeholder={required ? 'Enter your remark (required)...' : 'Enter your remark (optional)...'}
        rows={4}
        value={remark}
        onChange={(e) => {
          setRemark(e.target.value);
          if (error && e.target.value.trim()) setError('');
        }}
        maxLength={500}
        showCount
        style={{ resize: 'none' }}
        autoFocus
      />
      {error && (
        <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{error}</p>
      )}
    </Modal>
  );
}
