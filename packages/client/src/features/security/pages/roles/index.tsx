import { useMemo, useCallback, useState } from 'react';
import { Table, Tooltip, Space, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Role } from '../../types';
import type { CreateRoleInput, UpdateRoleInput } from '@gmss/types';
import { showConfirmModal } from '../../../../components/confirm-modal';
import Button from '../../../../components/button';
import styles from './styles.module.css';

interface RolesPageProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onCreate: () => void;
  onDelete: (roleId: string) => void;
  onSave: (role: CreateRoleInput | UpdateRoleInput) => Promise<void>;
  onCancel: () => void;
  visible: boolean;
  selectedRole: Role | null;
  isEditMode: boolean;
}

/**
 * Roles Management Page
 * Displays roles in a table with create/edit modal
 */
export default function RolesPage({
  roles,
  onEdit,
  onCreate,
  onDelete,
  onSave,
  onCancel,
  visible,
  selectedRole,
  isEditMode,
}: RolesPageProps) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All roles from the backend (no isDeleted/isActive filter needed)
  const activeRoles = roles;

  const handleEdit = useCallback((role: Role) => {
    onEdit(role);
  }, [onEdit]);

  const handleDelete = useCallback((role: Role) => {
    showConfirmModal({
      title: 'Delete Role',
      content: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: () => onDelete(role.id),
    });
  }, [onDelete]);

  const formatDate = useCallback((dateString: string | null | undefined): string => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      if (isEditMode && selectedRole) {
        const input: UpdateRoleInput = {
          id: selectedRole.id,
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
        };
        await onSave(input);
      } else {
        const input: CreateRoleInput = {
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
        };
        await onSave(input);
      }

      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, onSave, isEditMode, selectedRole]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onCancel();
  }, [form, onCancel]);

  // Populate form when modal opens
  useMemo(() => {
    if (visible) {
      if (isEditMode && selectedRole) {
        form.setFieldsValue({
          name: selectedRole.name,
          description: selectedRole.description || '',
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, selectedRole, isEditMode, form]);

  const columns: ColumnsType<Role> = useMemo(() => [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (name: string) => (
        <span className={styles.roleName}>{name}</span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      ellipsis: {
        showTitle: false,
      },
      render: (description?: string) => (
        description ? (
          <Tooltip title={description} placement="topLeft">
            <span className={styles.description}>{description}</span>
          </Tooltip>
        ) : (
          <span className={styles.emptyText}>—</span>
        )
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: '12%',
      render: (createdBy?: string) => (
        <span className={styles.secondaryText}>
          {createdBy || '—'}
        </span>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: '12%',
      render: (createdDate: string) => (
        <span className={styles.dateText}>
          {formatDate(createdDate)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      align: 'center',
      render: (_, role) => {
        return (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                variant="ghost"
                icon={<EditOutlined />}
                onClick={() => handleEdit(role)}
                size="small"
              />
            </Tooltip>
            
            <Tooltip title="Delete">
              <Button
                variant="danger"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(role)}
                size="small"
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ], [formatDate, handleEdit, handleDelete]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Roles</h2>
          <p className={styles.subtitle}>
            {activeRoles.length} role{activeRoles.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={onCreate}
        >
          Create Role
        </Button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <Table<Role>
          columns={columns}
          dataSource={activeRoles}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} roles`,
            className: styles.pagination,
          }}
          className={styles.table}
          size="middle"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <span className={styles.modalTitle}>
            {isEditMode ? 'Edit Role' : 'Create New Role'}
          </span>
        }
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={520}
        centered
        className={styles.modal}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
          autoComplete="off"
        >
          {/* Role Name */}
          <Form.Item
            label="Role Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter a role name' },
              { min: 2, message: 'Role name must be at least 2 characters' },
              { max: 50, message: 'Role name must not exceed 50 characters' },
              {
                pattern: /^[a-zA-Z0-9\s\-_]+$/,
                message: 'Role name can only contain letters, numbers, spaces, hyphens, and underscores',
              },
            ]}
            className={styles.formItem}
          >
            <Input
              placeholder="Enter role name"
              className={styles.input}
              maxLength={50}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { max: 200, message: 'Description must not exceed 200 characters' },
            ]}
            className={styles.formItem}
          >
            <Input.TextArea
              placeholder="Enter a brief description (optional)"
              rows={3}
              className={styles.textarea}
              maxLength={200}
              showCount
            />
          </Form.Item>

          {/* Info Text - Only show when creating new role */}
          {!isEditMode && (
            <div className={styles.infoText}>
              Permissions can be assigned to this role after creation.
            </div>
          )}

          {/* Footer Actions */}
          <div className={styles.footer}>
            <Space size="middle">
              <Button
                variant="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                {isEditMode ? 'Save Changes' : 'Create Role'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
