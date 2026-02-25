import { useEffect, useState, useCallback, memo } from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined, DeleteFilled } from '@ant-design/icons';
import type { User, Role } from '../../../types';
import type { CreateUserInput } from '@gmss/types';
import { showConfirmModal } from '../../../../../components/confirm-modal';
import Avatar from '../../../../../components/avatar';
import Button from '../../../../../components/button';
import styles from './styles.module.css';

type SaveData = CreateUserInput & { id?: string };

interface UserDetailsFormProps {
  user: User | null;
  onSave: (data: SaveData) => void;
  onCancel: () => void;
  onDelete?: (userId: string) => void;
  roles: Role[];
  isAddMode?: boolean;
}

/**
 * User details form component
 * Optimized with React.memo and useCallback
 */
function UserDetailsForm({
  user,
  onSave,
  onCancel,
  onDelete,
  roles = [],
  isAddMode = false,
}: UserDetailsFormProps) {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName || '',
        email: user.email,
        roleId: user.roleId,
      });
      setIsDirty(false);
    } else if (isAddMode) {
      form.resetFields();
      setIsDirty(false);
    }
  }, [user, isAddMode, form]);

  const handleFieldChange = useCallback(() => {
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      onSave({
        id: user?.id,
        firstName: values.firstName,
        lastName: values.lastName || undefined,
        email: values.email,
        roleId: values.roleId,
      });
      setIsDirty(false);
    } catch {
      // validation errors shown inline
    }
  }, [form, user, onSave]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    setIsDirty(false);
    onCancel();
  }, [form, onCancel]);

  const handleDelete = useCallback(() => {
    if (!user || !onDelete) return;
    showConfirmModal({
      title: 'Delete User',
      content: `Are you sure you want to delete ${user.firstName}${user.lastName ? ' ' + user.lastName : ''}?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => onDelete(user.id),
    });
  }, [user, onDelete]);

  if (!user && !isAddMode) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Select a user to view details</div>
      </div>
    );
  }

  const isNewUser = isAddMode || !user;

  return (
    <div className={styles.container}>
      {/* Header with Avatar */}
      <div className={styles.header}>
        <Row gutter={16} align="middle" justify="space-between" wrap={false}>
          <Col flex="auto" style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isNewUser ? (
                <div className={styles.newUserAvatar}>+</div>
              ) : (
                <Avatar
                  firstName={user!.firstName}
                  lastName={user!.lastName ?? undefined}
                  size={44}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <div className={styles.headerName}>
                  {isNewUser
                    ? 'New User'
                    : `${user!.firstName}${user!.lastName ? ' ' + user!.lastName : ''}`}
                </div>
                <div className={styles.headerEmail}>
                  {isNewUser ? 'Enter user details' : user!.email}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Form Content - Scrollable */}
      <div className={styles.formContent}>
        <Form
          form={form}
          layout="vertical"
          style={{ width: '100%' }}
          requiredMark={false}
          onValuesChange={handleFieldChange}
        >
          {/* User Details Section */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>User Details</div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={<>First Name<span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span></>}
                  name="firstName"
                  rules={[{ required: true, message: 'First name is required' }]}
                >
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name" name="lastName">
                  <Input placeholder="Enter last name (optional)" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<>Email Address<span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span></>}
              name="email"
              rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}
            >
              <Input placeholder="user@example.com" disabled={!isNewUser} />
            </Form.Item>
          </div>

          {/* User Role Section */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>User Role</div>
            <Form.Item
              label={<>Role<span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span></>}
              name="roleId"
              rules={[{ required: true, message: 'Role is required' }]}
            >
              <Select
                placeholder="Select role"
                options={roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
              />
            </Form.Item>
          </div>
        </Form>
      </div>

      {/* Footer Actions - Always Visible */}
      <div className={styles.footer}>
        <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'space-between' }}>
          <div>
            {!isNewUser && onDelete && (
              <Button
                variant="danger"
                onClick={handleDelete}
                icon={<DeleteFilled />}
                size="large"
              >
                Delete
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="secondary"
              onClick={handleCancel}
              icon={<CloseOutlined />}
              size="large"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              icon={<SaveOutlined />}
              disabled={!isDirty && !isNewUser}
              size="large"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(UserDetailsForm);