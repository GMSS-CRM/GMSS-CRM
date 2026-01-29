import { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { TagWithVendorCount } from '../types/tagTypes';
import styles from '../styles/tags.module.css';

interface EditTagModalProps {
  open: boolean;
  onClose: () => void;
  tag: TagWithVendorCount | null;
  onSubmit: (id: string, name: string) => Promise<boolean>;
  loading?: boolean;
}

export default function EditTagModal({
  open,
  onClose,
  tag,
  onSubmit,
  loading,
}: EditTagModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && tag) {
      form.setFieldsValue({ name: tag.name });
    }
  }, [open, tag, form]);

  const handleSubmit = async () => {
    if (!tag) return;
    
    try {
      const values = await form.validateFields();
      const success = await onSubmit(tag.id, values.name.trim());
      if (success) {
        onClose();
      }
    } catch (error) {
      // Validation error
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
          <EditOutlined className={styles.modalIcon} />
          Edit Tag
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
              placeholder="Enter tag name"
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
                Save Changes
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
