import { useState, useMemo, useCallback, useEffect } from 'react';
import { Select, Input, Table, message, Tooltip, Tag } from 'antd';
import {
  SearchOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Role } from '../../types';
import { PERMISSION_LABELS, ALL_PERMISSIONS } from '../../types';
import { useGetPermissionsByRoleId, useAssignPermissions } from '../../services/permissions.service';
import Button from '../../../../components/button';
import styles from './styles.module.css';

interface PermissionsPageProps {
  roles: Role[];
}

const MODULE_COLORS: Record<string, string> = {
  'Users':        'blue',
  'Roles':        'purple',
  'App Settings': 'orange',
};

/**
 * Permissions Management Page
 * Dual-panel UI backed by real backend data via Apollo.
 */
export default function PermissionsPage({ roles }: PermissionsPageProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    roles.length > 0 ? roles[0].id : null
  );
  const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [selectedAvailableKeys, setSelectedAvailableKeys] = useState<React.Key[]>([]);
  const [selectedRoleKeys, setSelectedRoleKeys] = useState<React.Key[]>([]);
  const [availableSearchText, setAvailableSearchText] = useState('');
  const [roleSearchText, setRoleSearchText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalRolePermissions, setOriginalRolePermissions] = useState<string[]>([]);

  // Apollo hooks
  const [loadPermissions, { loading: loadingPerms }] = useGetPermissionsByRoleId();
  const [assignPermissions, { loading: saving }] = useAssignPermissions();

  // Load permissions when role changes
  useEffect(() => {
    if (!selectedRoleId) {
      setAvailablePermissions([]);
      setRolePermissions([]);
      setOriginalRolePermissions([]);
      setHasChanges(false);
      return;
    }

    loadPermissions({ variables: { roleId: selectedRoleId } }).then(
      (result: { data?: { getPermissionsByRoleId?: string[] } }) => {
        const assigned: string[] = (result.data?.getPermissionsByRoleId ?? []) as string[];
        setRolePermissions(assigned);
        setOriginalRolePermissions(assigned);
        setAvailablePermissions(ALL_PERMISSIONS.filter((p) => !assigned.includes(p)));
        setHasChanges(false);
        setSelectedAvailableKeys([]);
        setSelectedRoleKeys([]);
      }
    );
  }, [selectedRoleId, loadPermissions]);

  const handleRoleChange = useCallback(
    (value: string) => {
      if (hasChanges) {
        if (!window.confirm('You have unsaved changes. Discard them?')) return;
      }
      setSelectedRoleId(value);
    },
    [hasChanges]
  );

  const handleAssignPermissions = useCallback(() => {
    if (selectedAvailableKeys.length === 0) return;
    const toAssign = availablePermissions.filter((p) => selectedAvailableKeys.includes(p));
    setRolePermissions((prev) => [...prev, ...toAssign]);
    setAvailablePermissions((prev) => prev.filter((p) => !selectedAvailableKeys.includes(p)));
    setSelectedAvailableKeys([]);
    setHasChanges(true);
  }, [selectedAvailableKeys, availablePermissions]);

  const handleRemovePermissions = useCallback(() => {
    if (selectedRoleKeys.length === 0) return;
    const toRemove = rolePermissions.filter((p) => selectedRoleKeys.includes(p));
    setAvailablePermissions((prev) => [...prev, ...toRemove]);
    setRolePermissions((prev) => prev.filter((p) => !selectedRoleKeys.includes(p)));
    setSelectedRoleKeys([]);
    setHasChanges(true);
  }, [selectedRoleKeys, rolePermissions]);

  const handleSave = useCallback(async () => {
    if (!selectedRoleId) return;
    try {
      await assignPermissions({
        variables: {
          input: {
            roleId: selectedRoleId,
            permissions: rolePermissions as any,
          },
        },
      });
      setOriginalRolePermissions(rolePermissions);
      setHasChanges(false);
      message.success('Permissions saved successfully');
    } catch (err) {
      console.error(err);
      message.error('Failed to save permissions');
    }
  }, [selectedRoleId, rolePermissions, assignPermissions]);

  const handleCancel = useCallback(() => {
    if (!hasChanges) return;
    setRolePermissions(originalRolePermissions);
    setAvailablePermissions(ALL_PERMISSIONS.filter((p) => !originalRolePermissions.includes(p)));
    setSelectedAvailableKeys([]);
    setSelectedRoleKeys([]);
    setHasChanges(false);
  }, [hasChanges, originalRolePermissions]);

  // Filtered lists based on search
  const filteredAvailable = useMemo(() => {
    if (!availableSearchText.trim()) return availablePermissions;
    const q = availableSearchText.toLowerCase();
    return availablePermissions.filter((p) => {
      const meta = PERMISSION_LABELS[p];
      return meta?.label.toLowerCase().includes(q) || meta?.module.toLowerCase().includes(q);
    });
  }, [availablePermissions, availableSearchText]);

  const filteredRole = useMemo(() => {
    if (!roleSearchText.trim()) return rolePermissions;
    const q = roleSearchText.toLowerCase();
    return rolePermissions.filter((p) => {
      const meta = PERMISSION_LABELS[p];
      return meta?.label.toLowerCase().includes(q) || meta?.module.toLowerCase().includes(q);
    });
  }, [rolePermissions, roleSearchText]);

  const permissionColumns: ColumnsType<string> = [
    {
      title: 'Permission',
      dataIndex: '',
      key: 'label',
      render: (_, perm) => (
        <span className={styles.permissionName}>{PERMISSION_LABELS[perm]?.label ?? perm}</span>
      ),
    },
    {
      title: 'Module',
      dataIndex: '',
      key: 'module',
      width: 130,
      render: (_, perm) => {
        const mod = PERMISSION_LABELS[perm]?.module ?? 'Other';
        return (
          <Tag color={MODULE_COLORS[mod] ?? 'default'} style={{ fontWeight: 500 }}>
            {mod}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header with Role Selector */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Permissions Management</h2>
          <p className={styles.subtitle}>
            Assign and manage permissions for roles • {ALL_PERMISSIONS.length} total permissions
          </p>
        </div>
        <div className={styles.roleSelector}>
          <label className={styles.label}>Select Role</label>
          <Select
            className={styles.roleSelect}
            placeholder="Select a role"
            value={selectedRoleId}
            onChange={handleRoleChange}
            options={roles.map((role) => ({ label: role.name, value: role.id }))}
            size="large"
            loading={loadingPerms}
          />
        </div>
      </div>

      {/* Main Content - Dual Panels */}
      {selectedRoleId && (
        <>
          <div className={styles.panelsContainer}>
            {/* Left Panel - Available Permissions */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleGroup}>
                  <UnorderedListOutlined className={styles.panelIcon} />
                  <h3 className={styles.panelTitle}>Available Permissions</h3>
                </div>
                <div className={styles.panelCounts}>
                  {selectedAvailableKeys.length > 0 && (
                    <span className={styles.selectedCount}>{selectedAvailableKeys.length} selected</span>
                  )}
                  <span className={styles.count}>
                    {availableSearchText.trim()
                      ? `${filteredAvailable.length} of ${availablePermissions.length}`
                      : `${availablePermissions.length}`}
                  </span>
                </div>
              </div>
              <div className={styles.searchContainer}>
                <Input
                  placeholder="Search permissions..."
                  prefix={<SearchOutlined />}
                  value={availableSearchText}
                  onChange={(e) => setAvailableSearchText(e.target.value)}
                  allowClear
                />
              </div>
              <div className={styles.tableWrapper}>
                <Table<string>
                  rowSelection={{
                    selectedRowKeys: selectedAvailableKeys,
                    onChange: setSelectedAvailableKeys,
                  }}
                  columns={permissionColumns}
                  dataSource={filteredAvailable}
                  rowKey={(p) => p}
                  pagination={false}
                  size="small"
                  loading={loadingPerms}
                  className={styles.table}
                />
              </div>
            </div>

            {/* Middle Controls */}
            <div className={styles.controls}>
              <Tooltip title="Assign selected permissions" placement="left">
                <Button
                  variant="ghost"
                  icon={<ArrowRightOutlined />}
                  onClick={handleAssignPermissions}
                  disabled={selectedAvailableKeys.length === 0}
                />
              </Tooltip>
              <Tooltip title="Remove selected permissions" placement="left">
                <Button
                  variant="ghost"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleRemovePermissions}
                  disabled={selectedRoleKeys.length === 0}
                />
              </Tooltip>
            </div>

            {/* Right Panel - Role Permissions */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleGroup}>
                  <CheckCircleOutlined className={styles.panelIcon} />
                  <h3 className={styles.panelTitle}>Role Permissions</h3>
                </div>
                <div className={styles.panelCounts}>
                  {selectedRoleKeys.length > 0 && (
                    <span className={styles.selectedCount}>{selectedRoleKeys.length} selected</span>
                  )}
                  <span className={styles.count}>
                    {roleSearchText.trim()
                      ? `${filteredRole.length} of ${rolePermissions.length}`
                      : `${rolePermissions.length}`}
                  </span>
                </div>
              </div>
              <div className={styles.searchContainer}>
                <Input
                  placeholder="Search permissions..."
                  prefix={<SearchOutlined />}
                  value={roleSearchText}
                  onChange={(e) => setRoleSearchText(e.target.value)}
                  allowClear
                />
              </div>
              <div className={styles.tableWrapper}>
                <Table<string>
                  rowSelection={{
                    selectedRowKeys: selectedRoleKeys,
                    onChange: setSelectedRoleKeys,
                  }}
                  columns={permissionColumns}
                  dataSource={filteredRole}
                  rowKey={(p) => p}
                  pagination={false}
                  size="small"
                  loading={loadingPerms}
                  className={styles.table}
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              {hasChanges && (
                <div className={styles.changesMessage}>
                  <ExclamationCircleOutlined />
                  <span>You have unsaved changes. Save or cancel to continue.</span>
                </div>
              )}
            </div>
            <div className={styles.footerRight}>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={!hasChanges}
                icon={<CloseOutlined />}
                size="large"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!hasChanges}
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
              >
                Save
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}