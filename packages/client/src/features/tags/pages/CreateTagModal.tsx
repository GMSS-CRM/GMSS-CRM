import  { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import styles from '../styles/tags.module.css';

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
  loading?: boolean;
}

export default function CreateTagModal({
  open,
  onClose,
  onSubmit,
  loading,
}: CreateTagModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = await onSubmit(values.name.trim());
      if (success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      // Validation error - handled by form
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      title={
        <div className={styles.modalTitle}>
          <TagOutlined className={styles.modalIcon} />
          Create New Tag
        </div>
      }
      width={480}
      footer={null}
      destroyOnClose
    >
      <div className={styles.formContainer}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tag Name"
            rules={[
              { required: true, message: 'Please enter a tag name' },
              { min: 2, message: 'Tag name must be at least 2 characters' },
              { max: 50, message: 'Tag name cannot exceed 50 characters' },
              { whitespace: true, message: 'Tag name cannot be empty' },
            ]}
          >
            <Input
              placeholder="e.g., Electronics, IT Services, Construction"
              prefix={<TagOutlined style={{ color: '#bfbfbf' }} />}
              autoFocus
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Create Tag
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
