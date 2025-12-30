import { useEffect, useState, useCallback, memo } from 'react';
import { Form, Input, Button, Select, Switch, Row, Col, Avatar } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { User, Role, Restriction } from '../types';
import styles from './UserDetailsForm.module.css';

interface UserDetailsFormProps {
  user: User | null;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
  roles: Role[];
  restrictions: Restriction[];
}

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * User details form component
 * Optimized with React.memo and useCallback
 */
function UserDetailsForm({
  user,
  onSave,
  onCancel,
  roles = [],
  restrictions = [],
}: UserDetailsFormProps) {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        middleName: user.middleName || '',
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        restrictions: user.restrictions,
        isActive: user.isActive,
      });
      setIsDirty(false);
    }
  }, [user, form]);

  const handleFieldChange = useCallback(() => {
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      
      if (user) {
        const updatedUser: User = {
          ...user,
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          roles: values.roles || [],
          restrictions: values.restrictions || [],
          isActive: values.isActive,
        };
        onSave(updatedUser);
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  }, [form, user, onSave]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    setIsDirty(false);
    onCancel();
  }, [form, onCancel]);

  const handleActiveToggle = useCallback(() => {
    form.setFieldValue('isActive', !form.getFieldValue('isActive'));
    handleFieldChange();
  }, [form, handleFieldChange]);

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Select a user to view details</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header with Avatar and Active Toggle */}
      <div className={styles.header}>
        <Row gutter={20} align="middle" justify="space-between" wrap={false}>
          <Col flex="auto" style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar size={56} className={styles.avatar}>
                {getInitials(user.firstName, user.lastName)}
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <div className={styles.headerName}>
                  {user.firstName} {user.lastName}
                </div>
                <div className={styles.headerEmail}>{user.email}</div>
              </div>
            </div>
          </Col>
          <Col flex="none">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className={`${styles.statusText} ${user.isActive ? styles.active : ''}`}>
                {user.isActive ? '● Active' : '● Inactive'}
              </div>
              <Switch checked={user.isActive} onChange={handleActiveToggle} />
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
          onValuesChange={handleFieldChange}
        >
        {/* User Details Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>User Details</div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'First name is required' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Last name is required' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Middle Name"
            name="middleName"
          >
            <Input placeholder="Enter middle name (optional)" />
          </Form.Item>

          <Form.Item
            label="User Name (UPN)"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}
          >
            <Input placeholder="user@example.com" disabled />
          </Form.Item>
        </div>

        {/* User Roles Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>User Roles</div>
          <Form.Item
            label="Roles"
            name="roles"
          >
            <Select
              mode="multiple"
              placeholder="Select roles"
              options={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
              optionLabelProp="label"
            />
          </Form.Item>
        </div>

        {/* User Restrictions Section */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>User Restrictions</div>
          <Form.Item
            label="Equipment Tag"
            name="restrictions"
          >
            <Select
              mode="multiple"
              placeholder="Select restrictions"
              options={restrictions.map((restriction) => ({
                label: restriction.name,
                value: restriction.id,
              }))}
              optionLabelProp="label"
            />
          </Form.Item>
        </div>

        <Form.Item name="isActive" hidden>
          <Input type="hidden" />
        </Form.Item>
        </Form>
      </div>

      {/* Footer Actions - Always Visible */}
      <div className={styles.footer}>
        <Button
          onClick={handleCancel}
          icon={<CloseOutlined />}
          size="large"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          icon={<SaveOutlined />}
          disabled={!isDirty}
          size="large"
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default memo(UserDetailsForm);
