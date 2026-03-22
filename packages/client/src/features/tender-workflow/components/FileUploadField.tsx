import React, { useState } from 'react';
import { Upload, Button, Space, Typography, message, Spin } from 'antd';
import { UploadOutlined, FileOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import { useFirebaseUpload } from '../hooks/useFirebaseUpload';

const { Text } = Typography;

interface FileUploadFieldProps {
  /** Current file URL (if already uploaded) */
  value?: string;
  /** Callback when upload completes or file is removed */
  onChange?: (url: string) => void;
  /** Firebase folder path, e.g. 'post-award/quotes' */
  folder: string;
  /** Accepted file types, e.g. '.pdf,.doc,.docx,.jpg,.png' */
  accept?: string;
  /** Button label */
  buttonText?: string;
  /** Disable interactions */
  disabled?: boolean;
}

/**
 * Reusable Firebase file upload field for Ant Design forms.
 *
 * Replaces plain URL text inputs — uploads to Firebase Cloud Storage
 * and stores the resulting public URL.
 */
const FileUploadField: React.FC<FileUploadFieldProps> = ({
  value,
  onChange,
  folder,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
  buttonText = 'Upload File',
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useFirebaseUpload();

  const handleUpload = async (file: RcFile) => {
    setUploading(true);
    try {
      const { downloadUrl } = await uploadFile(file, folder);
      onChange?.(downloadUrl);
      message.success(`${file.name} uploaded`);
    } catch {
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
    return false; // prevent default upload behaviour
  };

  const handleRemove = () => {
    onChange?.('');
  };

  const fileName = value ? decodeURIComponent(value.split('/').pop() ?? '') : '';

  if (uploading) {
    return (
      <Space>
        <Spin size="small" />
        <Text type="secondary">Uploading…</Text>
      </Space>
    );
  }

  if (value) {
    return (
      <Space size={4} style={{ width: '100%' }} wrap>
        <FileOutlined style={{ color: '#1677ff' }} />
        <a href={value} target="_blank" rel="noopener noreferrer" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'middle' }}>
          {fileName || 'View File'}
        </a>
        <Button
          size="small"
          type="text"
          icon={<LinkOutlined />}
          onClick={() => window.open(value, '_blank')}
          title="Open in new tab"
        />
        {!disabled && (
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            title="Remove file"
          />
        )}
      </Space>
    );
  }

  return (
    <Upload
      beforeUpload={handleUpload}
      showUploadList={false}
      maxCount={1}
      accept={accept}
      disabled={disabled}
    >
      <Button icon={<UploadOutlined />} disabled={disabled}>
        {buttonText}
      </Button>
    </Upload>
  );
};

export default FileUploadField;
