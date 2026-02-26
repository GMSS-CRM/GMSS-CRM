// packages/client/src/features/tags/pages/CreateTagModal.tsx
import { Modal, Form, Input } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import styles from '../styles/tags.module.css';

interface CreateTagModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: { name: string }) => Promise<void>;
  loading?: boolean;
}

export default function CreateTagModal({
  open,
  onCancel,
  onSubmit,
  loading = false,
}: CreateTagModalProps) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      // Validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <span className={styles.modalTitle}>
          <TagOutlined className={styles.modalIcon} />
          Create New Tag
        </span>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Create Tag"
      confirmLoading={loading}
      destroyOnClose
    >
      <div className={styles.formContainer}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tag Name"
            rules={[
              { required: true, message: 'Please enter a tag name' },
              { min: 2, message: 'Tag name must be at least 2 characters' },
              { max: 50, message: 'Tag name cannot exceed 50 characters' },
            ]}
          >
            <Input 
              placeholder="Enter tag name (e.g., Electronics, IT Services)" 
              prefix={<TagOutlined style={{ color: '#bfbfbf' }} />}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}