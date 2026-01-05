import { useState, useMemo, useCallback, useEffect } from 'react';
import { Select, Input, Table, message, Tooltip } from 'antd';
import { 
  SearchOutlined, 
  ArrowRightOutlined, 
  ArrowLeftOutlined, 
  UnorderedListOutlined, 
  CheckCircleOutlined, 
  SaveOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Role, Permission } from '../../types';
import Button from '../../../../components/button';
import styles from './styles.module.css';

interface PermissionsPageProps {
  roles: Role[];
}

/**
 * Mock permissions data - In production, fetch from API
 */
const MOCK_PERMISSIONS: Permission[] = [
  { id: '1', name: 'view_users', description: 'View user list', module: 'Users', isActive: true, createdDate: new Date().toISOString() },
  { id: '2', name: 'create_users', description: 'Create new users', module: 'Users', isActive: true, createdDate: new Date().toISOString() },
  { id: '3', name: 'edit_users', description: 'Edit user details', module: 'Users', isActive: true, createdDate: new Date().toISOString() },
  { id: '4', name: 'delete_users', description: 'Delete users', module: 'Users', isActive: true, createdDate: new Date().toISOString() },
  { id: '5', name: 'view_roles', description: 'View roles list', module: 'Roles', isActive: true, createdDate: new Date().toISOString() },
  { id: '6', name: 'create_roles', description: 'Create new roles', module: 'Roles', isActive: true, createdDate: new Date().toISOString() },
  { id: '7', name: 'edit_roles', description: 'Edit role details', module: 'Roles', isActive: true, createdDate: new Date().toISOString() },
  { id: '8', name: 'delete_roles', description: 'Delete roles', module: 'Roles', isActive: true, createdDate: new Date().toISOString() },
  { id: '9', name: 'view_permissions', description: 'View permissions', module: 'Permissions', isActive: true, createdDate: new Date().toISOString() },
  { id: '10', name: 'assign_permissions', description: 'Assign permissions to roles', module: 'Permissions', isActive: true, createdDate: new Date().toISOString() },
  { id: '11', name: 'view_dashboard', description: 'Access dashboard', module: 'Dashboard', isActive: true, createdDate: new Date().toISOString() },
  { id: '12', name: 'view_reports', description: 'View reports', module: 'Reports', isActive: true, createdDate: new Date().toISOString() },
  { id: '13', name: 'export_data', description: 'Export data to files', module: 'Reports', isActive: true, createdDate: new Date().toISOString() },
  { id: '14', name: 'manage_settings', description: 'Manage system settings', module: 'Settings', isActive: true, createdDate: new Date().toISOString() },
  { id: '15', name: 'view_audit_logs', description: 'View audit logs', module: 'Audit', isActive: true, createdDate: new Date().toISOString() },
];

/**
 * Mock role-permission mappings - In production, fetch from API
 */
const MOCK_ROLE_PERMISSIONS: Record<string, string[]> = {
  '1': ['1', '11'], // Member: view_users, view_dashboard
  '2': ['1', '3', '5', '11', '12'], // Manager: view_users, edit_users, view_roles, view_dashboard, view_reports
  '3': ['1', '2', '3', '5', '6', '7', '11', '12', '13'], // Director: expanded permissions
  '4': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'], // System Administrator: all
};

/**
 * Permissions Management Page
 * Allows assigning and removing permissions for roles using dual-list transfer UI
 */
export default function PermissionsPage({ roles }: PermissionsPageProps) {
  // Active roles for dropdown
  const activeRoles = useMemo(() => {
    return roles.filter(role => role.isActive && !role.isDeleted);
  }, [roles]);

  // State - Initialize with first role
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    activeRoles.length > 0 ? activeRoles[0].id : null
  );
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [selectedAvailableKeys, setSelectedAvailableKeys] = useState<React.Key[]>([]);
  const [selectedRoleKeys, setSelectedRoleKeys] = useState<React.Key[]>([]);
  const [availableSearchText, setAvailableSearchText] = useState('');
  const [roleSearchText, setRoleSearchText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Store original state for cancel functionality
  const [originalRolePermissions, setOriginalRolePermissions] = useState<Permission[]>([]);

  // Load permissions when role is selected
  useEffect(() => {
    if (selectedRoleId) {
      loadPermissionsForRole(selectedRoleId);
    } else {
      setAvailablePermissions([]);
      setRolePermissions([]);
      setOriginalRolePermissions([]);
    }
    setHasChanges(false);
    setSelectedAvailableKeys([]);
    setSelectedRoleKeys([]);
  }, [selectedRoleId]);

  /**
   * Load permissions for selected role
   * In production, this would call the API
   */
  const loadPermissionsForRole = useCallback((roleId: string) => {
    // Get assigned permission IDs for this role
    const assignedPermissionIds = MOCK_ROLE_PERMISSIONS[roleId] || [];
    
    // Split permissions into assigned and available
    const assigned = MOCK_PERMISSIONS.filter(p => assignedPermissionIds.includes(p.id));
    const available = MOCK_PERMISSIONS.filter(p => !assignedPermissionIds.includes(p.id));
    
    setRolePermissions(assigned);
    setOriginalRolePermissions(assigned);
    setAvailablePermissions(available);
  }, []);

  /**
   * Handle role selection change
   */
  const handleRoleChange = useCallback((value: string) => {
    if (hasChanges) {
      // Show confirmation if there are unsaved changes
      const confirmed = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirmed) {
        return;
      }
    }
    setSelectedRoleId(value);
  }, [hasChanges]);

  /**
   * Assign selected permissions to role
   */
  const handleAssignPermissions = useCallback(() => {
    if (selectedAvailableKeys.length === 0) return;

    const permissionsToAssign = availablePermissions.filter(p => 
      selectedAvailableKeys.includes(p.id)
    );

    setRolePermissions([...rolePermissions, ...permissionsToAssign]);
    setAvailablePermissions(availablePermissions.filter(p => 
      !selectedAvailableKeys.includes(p.id)
    ));
    setSelectedAvailableKeys([]);
    setHasChanges(true);
  }, [selectedAvailableKeys, availablePermissions, rolePermissions]);

  /**
   * Remove selected permissions from role
   */
  const handleRemovePermissions = useCallback(() => {
    if (selectedRoleKeys.length === 0) return;

    const permissionsToRemove = rolePermissions.filter(p => 
      selectedRoleKeys.includes(p.id)
    );

    setAvailablePermissions([...availablePermissions, ...permissionsToRemove]);
    setRolePermissions(rolePermissions.filter(p => 
      !selectedRoleKeys.includes(p.id)
    ));
    setSelectedRoleKeys([]);
    setHasChanges(true);
  }, [selectedRoleKeys, rolePermissions, availablePermissions]);

  /**
   * Save permission changes
   */
  const handleSave = useCallback(async () => {
    if (!selectedRoleId) return;

    try {
      // TODO: Call API to save permission changes
      // const permissionIds = rolePermissions.map(p => p.id);
      // await assignPermissionsToRole(selectedRoleId, permissionIds);
      
      setOriginalRolePermissions(rolePermissions);
      setHasChanges(false);
      message.success('Permissions saved successfully');
    } catch (error) {
      console.error('Failed to save permissions:', error);
      message.error('Failed to save permissions');
    }
  }, [selectedRoleId, rolePermissions]);

  /**
   * Cancel changes and revert to original state
   */
  const handleCancel = useCallback(() => {
    if (!hasChanges) return;

    // Restore original permissions
    const assignedIds = originalRolePermissions.map(p => p.id);
    const available = MOCK_PERMISSIONS.filter(p => !assignedIds.includes(p.id));
    
    setRolePermissions(originalRolePermissions);
    setAvailablePermissions(available);
    setSelectedAvailableKeys([]);
    setSelectedRoleKeys([]);
    setHasChanges(false);
  }, [hasChanges, originalRolePermissions]);

  // Filter available permissions based on search
  const filteredAvailablePermissions = useMemo(() => {
    if (!availableSearchText.trim()) return availablePermissions;
    const query = availableSearchText.toLowerCase();
    return availablePermissions.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.module && p.module.toLowerCase().includes(query))
    );
  }, [availablePermissions, availableSearchText]);

  // Filter role permissions based on search
  const filteredRolePermissions = useMemo(() => {
    if (!roleSearchText.trim()) return rolePermissions;
    const query = roleSearchText.toLowerCase();
    return rolePermissions.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.module && p.module.toLowerCase().includes(query))
    );
  }, [rolePermissions, roleSearchText]);

  // Table columns for available permissions
  const availableColumns: ColumnsType<Permission> = [
    {
      title: 'Permission Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className={styles.permissionName}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <span className={styles.description}>{text || '—'}</span>,
    },
  ];

  // Table columns for role permissions
  const roleColumns: ColumnsType<Permission> = [
    {
      title: 'Permission Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className={styles.permissionName}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <span className={styles.description}>{text || '—'}</span>,
    },
  ];

  // Row selection for available permissions
  const availableRowSelection = {
    selectedRowKeys: selectedAvailableKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedAvailableKeys(selectedKeys);
    },
  };

  // Row selection for role permissions
  const roleRowSelection = {
    selectedRowKeys: selectedRoleKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRoleKeys(selectedKeys);
    },
  };

  return (
    <div className={styles.container}>
      {/* Header with Role Selector */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Permissions Management</h2>
          <p className={styles.subtitle}>
            Assign and manage permissions for roles • {MOCK_PERMISSIONS.length} total permissions
          </p>
        </div>
        <div className={styles.roleSelector}>
          <label className={styles.label}>Select Role</label>
          <Select
            className={styles.roleSelect}
            placeholder="Select a role"
            value={selectedRoleId}
            onChange={handleRoleChange}
            options={activeRoles.map(role => ({
              label: role.name,
              value: role.id,
            }))}
            size="large"
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
                    <span className={styles.selectedCount}>
                      {selectedAvailableKeys.length} selected
                    </span>
                  )}
                  <span className={styles.count}>
                    {availableSearchText.trim() 
                      ? `${filteredAvailablePermissions.length} of ${availablePermissions.length}` 
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
                <Table
                  rowSelection={availableRowSelection}
                  columns={availableColumns}
                  dataSource={filteredAvailablePermissions}
                  rowKey="id"
                  pagination={false}
                  size="small"
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
                    <span className={styles.selectedCount}>
                      {selectedRoleKeys.length} selected
                    </span>
                  )}
                  <span className={styles.count}>
                    {roleSearchText.trim() 
                      ? `${filteredRolePermissions.length} of ${rolePermissions.length}` 
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
                <Table
                  rowSelection={roleRowSelection}
                  columns={roleColumns}
                  dataSource={filteredRolePermissions}
                  rowKey="id"
                  pagination={false}
                  size="small"
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
