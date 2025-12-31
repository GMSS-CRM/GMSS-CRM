import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export interface ConfirmModalOptions {
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger' | 'default';
  onOk: () => void;
  onCancel?: () => void;
}

/**
 * Reusable confirm modal utility
 * Displays a centered confirmation dialog with customizable options
 */
export const showConfirmModal = ({
  title,
  content,
  okText = 'OK',
  cancelText = 'Cancel',
  okType = 'primary',
  onOk,
  onCancel,
}: ConfirmModalOptions) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText,
    okType,
    centered: true,
    onOk,
    onCancel,
  });
};
