import { useState, useEffect, useCallback } from 'react';
import { message, Spin } from 'antd';
import { UserOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons';
import SubMenu from '../../../components/sub-menu';
import type { SubMenuItemConfig } from '../../../components/sub-menu';
import UsersList from './users/list';
import UserDetailsForm from './users/details-form';
import RolesPage from './roles';
import PermissionsPage from './permissions';
import type { Role } from '../types';
import type { CreateUserInput, CreateRoleInput, UpdateRoleInput } from '@gmss/types';
import {
  useSearchUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../services/users.service';
import {
  useSearchRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from '../services/roles.service';
import { createFirebaseUser } from '../../../app/config/firebase';
import styles from './index.module.css';

type SecuritySubMenuItem = 'users' | 'roles' | 'permissions';

const SECURITY_MENU_ITEMS: SubMenuItemConfig[] = [
  { key: 'users',       icon: <UserOutlined />,   label: 'Users' },
  { key: 'roles',       icon: <TeamOutlined />,   label: 'Roles' },
  { key: 'permissions', icon: <LockOutlined />,   label: 'Permissions' },
];

export default function SecurityPage() {
  const [selectedSubMenu, setSelectedSubMenu] = useState<SecuritySubMenuItem>('users');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Roles modal state
  const [isRoleFormVisible, setIsRoleFormVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isRoleEditMode, setIsRoleEditMode] = useState(false);

  // ─── Apollo queries ────────────────────────────────────────────────────────
  const { data: usersData, loading: usersLoading } = useSearchUsers();
  const { data: rolesData, loading: rolesLoading } = useSearchRoles();

  const users = usersData?.searchUsers ?? [];
  const roles = rolesData?.searchRoles ?? [];

  // ─── Apollo mutations ──────────────────────────────────────────────────────
  const [createUserMutation] = useCreateUser();
  const [updateUserMutation] = useUpdateUser();
  const [deleteUserMutation] = useDeleteUser();
  const [createRoleMutation] = useCreateRole();
  const [updateRoleMutation] = useUpdateRole();
  const [deleteRoleMutation] = useDeleteRole();

  // Auto-select first user
  useEffect(() => {
    if (selectedSubMenu === 'users' && users.length > 0 && !selectedUserId && !isAddMode) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId, selectedSubMenu, isAddMode]);

  // ─── User handlers ─────────────────────────────────────────────────────────
  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setIsAddMode(false);
  }, []);

  const handleAddUser = useCallback(() => {
    setIsAddMode(true);
    setSelectedUserId(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsAddMode(false);
    if (!isAddMode && users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, [isAddMode, users]);

  const handleSaveUser = useCallback(
    async (data: CreateUserInput & { id?: string }) => {
      const { id, firstName, lastName, email, roleId } = data;

      try {
        if (!id) {
          // ── ADD MODE: Firebase first, then DB ──────────────────────────────
          let firebaseUid: string | null = null;
          try {
            firebaseUid = await createFirebaseUser(email);
          } catch (fbErr: any) {
            const msg =
              fbErr?.code === 'auth/email-already-in-use'
                ? 'A Firebase account with that email already exists.'
                : `Firebase account creation failed: ${fbErr?.message ?? fbErr}`;
            message.error(msg);
            return;
          }

          try {
            const result = await createUserMutation({
              variables: { input: { firstName, lastName, email, roleId } },
            });
            setSelectedUserId(result.data?.createUser.id ?? null);
            setIsAddMode(false);
            message.success('User created successfully. A password-reset email has been sent.');
          } catch (dbErr: any) {
            console.error('DB create failed after Firebase account was created:', dbErr);
            message.error(
              'User saved to Firebase but could not be saved to the database. Please contact support.'
            );
          }
        } else {
          // ── EDIT MODE: update DB only ──────────────────────────────────────
          await updateUserMutation({
            variables: { id, input: { firstName, lastName, roleId } },
          });
          message.success('User updated successfully');
        }
      } catch (err: any) {
        console.error(err);
        message.error(`Failed to save user: ${err?.message ?? err}`);
      }
    },
    [createUserMutation, updateUserMutation]
  );

  const handleDeleteUser = useCallback(
    async (userId: string) => {
      try {
        await deleteUserMutation({ variables: { id: userId } });
        message.success('User deleted successfully');
        setSelectedUserId(null);
        setIsAddMode(false);
      } catch (err: any) {
        console.error(err);
        message.error(`Failed to delete user: ${err?.message ?? err}`);
      }
    },
    [deleteUserMutation]
  );

  // ─── Role handlers ─────────────────────────────────────────────────────────
  const handleCreateRole = useCallback(() => {
    setSelectedRole(null);
    setIsRoleEditMode(false);
    setIsRoleFormVisible(true);
  }, []);

  const handleEditRole = useCallback((role: Role) => {
    setSelectedRole(role);
    setIsRoleEditMode(true);
    setIsRoleFormVisible(true);
  }, []);

  const handleSaveRole = useCallback(
    async (roleData: CreateRoleInput | UpdateRoleInput) => {
      try {
        if (isRoleEditMode && selectedRole) {
          await updateRoleMutation({
            variables: { input: roleData as UpdateRoleInput },
          });
          message.success('Role updated successfully');
        } else {
          await createRoleMutation({
            variables: { input: roleData as CreateRoleInput },
          });
          message.success('Role created successfully');
        }
        setIsRoleFormVisible(false);
        setSelectedRole(null);
      } catch (err: any) {
        console.error(err);
        message.error(`Failed to save role: ${err?.message ?? err}`);
      }
    },
    [isRoleEditMode, selectedRole, createRoleMutation, updateRoleMutation]
  );

  const handleCancelRoleForm = useCallback(() => {
    setIsRoleFormVisible(false);
    setSelectedRole(null);
  }, []);

  const handleDeleteRole = useCallback(
    async (roleId: string) => {
      try {
        await deleteRoleMutation({ variables: { id: roleId } });
        message.success('Role deleted successfully');
      } catch (err: any) {
        console.error(err);
        message.error(`Failed to delete role: ${err?.message ?? err}`);
      }
    },
    [deleteRoleMutation]
  );

  // ─── Derived ───────────────────────────────────────────────────────────────
  const selectedUser = isAddMode ? null : users.find((u) => u.id === selectedUserId) ?? null;
  const isLoading = usersLoading || rolesLoading;

  return (
    <div className={styles.container}>
      {/* Left: Security Sub-Navigation Menu */}
      <div className={styles.menuSection}>
        <SubMenu
          title="Security"
          selectedMenu={selectedSubMenu}
          onMenuChange={(key) => setSelectedSubMenu(key as SecuritySubMenuItem)}
          items={SECURITY_MENU_ITEMS}
        />
      </div>

      {isLoading && (
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Center: Users List */}
          {selectedSubMenu === 'users' && (
            <div className={styles.listSection}>
              <UsersList
                users={users}
                selectedUserId={selectedUserId}
                onUserSelect={handleUserSelect}
                onAddUser={handleAddUser}
              />
            </div>
          )}

          {/* Right: User Details Form */}
          {selectedSubMenu === 'users' && (
            <div className={styles.formSection}>
              <UserDetailsForm
                user={selectedUser}
                onSave={handleSaveUser}
                onCancel={handleCancelEdit}
                onDelete={handleDeleteUser}
                roles={roles}
                isAddMode={isAddMode}
              />
            </div>
          )}

          {/* Roles Section */}
          {selectedSubMenu === 'roles' && (
            <div className={styles.rolesSection}>
              <RolesPage
                roles={roles}
                onEdit={handleEditRole}
                onCreate={handleCreateRole}
                onDelete={handleDeleteRole}
                onSave={handleSaveRole}
                onCancel={handleCancelRoleForm}
                visible={isRoleFormVisible}
                selectedRole={selectedRole}
                isEditMode={isRoleEditMode}
              />
            </div>
          )}

          {/* Permissions Section */}
          {selectedSubMenu === 'permissions' && (
            <div className={styles.rolesSection}>
              <PermissionsPage roles={roles} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
