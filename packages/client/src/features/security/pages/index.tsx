import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import SubMenu from '../../../components/sub-menu';
import type { SubMenuItem } from '../../../components/sub-menu';
import UsersList from './users/list';
import UserDetailsForm from './users/details-form';
import RolesPage from './roles';
import PermissionsPage from './permissions';
import type { User, Role } from '../types';
import { createRole, updateRole, deleteRole } from '../services/roles.service';
import styles from './index.module.css';

/**
 * Initial roles data - This is the master list of all roles
 * In production, this would be fetched from the API
 */
const INITIAL_ROLES: Role[] = [
  {
    id: '1',
    name: 'Member',
    description: 'Basic team member access',
    isActive: true,
    isDeleted: false,
    createdBy: 'system',
    createdDate: new Date('2024-01-15').toISOString(),
    userCount: 3,
    isSystemRole: true,
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Team management access',
    isActive: true,
    isDeleted: false,
    createdBy: 'admin',
    createdDate: new Date('2024-01-20').toISOString(),
    userCount: 2,
    isSystemRole: false,
  },
  {
    id: '3',
    name: 'Director',
    description: 'Department director access with full oversight capabilities',
    isActive: true,
    isDeleted: false,
    createdBy: 'admin',
    createdDate: new Date('2024-02-01').toISOString(),
    userCount: 1,
    isSystemRole: false,
  },
  {
    id: '4',
    name: 'System Administrator',
    description: 'Full system access',
    isActive: true,
    isDeleted: false,
    createdBy: 'system',
    createdDate: new Date('2024-01-10').toISOString(),
    userCount: 1,
    isSystemRole: true,
  },
];

const MOCK_USERS: User[] = [
  { id: '1', firstName: 'Rajesh', lastName: 'Kumar', email: 'rkumar@gmss.com', role: '1', isActive: true },
  { id: '2', firstName: 'Priya', lastName: 'Singh', email: 'psingh@gmss.com', role: '2', isActive: true },
  { id: '3', firstName: 'Amit', lastName: 'Verma', email: 'averma@gmss.com', role: '5', isActive: true },
  { id: '4', firstName: 'Neha', lastName: 'Patel', email: 'npatel@gmss.com', role: '4', isActive: true },
  { id: '5', firstName: 'Vikram', lastName: 'Shrivastav', email: 'vshrivastav@gmss.com', role: '5', isActive: true },
  { id: '6', firstName: 'Anjali', lastName: 'Sharma', email: 'asharma@gmss.com', role: '3', isActive: true },
  { id: '7', firstName: 'Arjun', lastName: 'Nair', email: 'anair@gmss.com', role: '1', isActive: true },
  { id: '8', firstName: 'Sneha', lastName: 'Gupta', email: 'sgupta@gmss.com', role: '2', isActive: false },
  { id: '9', firstName: 'Rohit', lastName: 'Desai', email: 'rdesai@gmss.com', role: '1', isActive: true },
  { id: '10', firstName: 'Divya', lastName: 'Rao', email: 'drao@gmss.com', role: '5', isActive: true },
];

/**
 * Main Security Page component
 * Manages both Users and Roles with shared state
 * Roles are the single source of truth used across the application
 */
export default function SecurityPage() {
  const [selectedSubMenu, setSelectedSubMenu] = useState<SubMenuItem>('users');
  
  // Shared roles state - single source of truth
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  
  // Users state
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  
  // Roles management state
  const [isRoleFormVisible, setIsRoleFormVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isRoleEditMode, setIsRoleEditMode] = useState(false);

  // Initialize roles - in production, fetch from API
  useEffect(() => {
    // TODO: Replace with actual API call
    // const loadRoles = async () => {
    //   try {
    //     const fetchedRoles = await fetchRoles();
    //     setRoles(fetchedRoles);
    //   } catch (error) {
    //     console.error('Failed to fetch roles:', error);
    //     message.error('Failed to load roles');
    //   }
    // };
    // loadRoles();
  }, []);

  // Auto-select first user on mount
  useEffect(() => {
    if (selectedSubMenu === 'users' && users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId, selectedSubMenu]);

  // Users handlers
  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setIsAddMode(false);
  }, []);

  const handleSaveUser = useCallback((updatedUser: User) => {
    setUsers((prevUsers) => {
      const existingIndex = prevUsers.findIndex((u) => u.id === updatedUser.id);
      let newUsers: User[];
      
      if (existingIndex >= 0) {
        // Update existing user
        const oldUser = prevUsers[existingIndex];
        newUsers = [...prevUsers];
        newUsers[existingIndex] = updatedUser;
        
        // Update role counts if role changed
        if (oldUser.role !== updatedUser.role) {
          setRoles((prevRoles) =>
            prevRoles.map((r) => {
              if (r.id === oldUser.role) {
                return { ...r, userCount: (r.userCount || 0) - 1 };
              }
              if (r.id === updatedUser.role) {
                return { ...r, userCount: (r.userCount || 0) + 1 };
              }
              return r;
            })
          );
        }
      } else {
        // Add new user
        newUsers = [...prevUsers, updatedUser];
        
        // Update role count for the new user's role
        if (updatedUser.role) {
          setRoles((prevRoles) =>
            prevRoles.map((r) =>
              r.id === updatedUser.role ? { ...r, userCount: (r.userCount || 0) + 1 } : r
            )
          );
        }
      }
      
      return newUsers;
    });
    message.success(isAddMode ? 'User added successfully' : 'User updated successfully');
    setSelectedUserId(updatedUser.id);
    setIsAddMode(false);
  }, [isAddMode]);

  const handleCancelEdit = useCallback(() => {
    if (isAddMode) {
      setIsAddMode(false);
      // Auto-select first user if available
      if (users.length > 0) {
        setSelectedUserId(users[0].id);
      }
    } else {
      // Reset by re-selecting (triggers form refresh)
      if (selectedUserId) setSelectedUserId(selectedUserId);
    }
  }, [isAddMode, selectedUserId, users]);

  const handleAddUser = useCallback(() => {
    setIsAddMode(true);
    setSelectedUserId(null);
  }, []);

  const handleDeleteUser = useCallback((userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    
    // Update role count if user had a role
    if (userToDelete?.role) {
      setRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.id === userToDelete.role ? { ...r, userCount: Math.max(0, (r.userCount || 0) - 1) } : r
        )
      );
    }
    
    message.success('User deleted successfully');
    setSelectedUserId(null);
    setIsAddMode(false);
    
    // Auto-select first user if available
    setTimeout(() => {
      if (users.length > 1) {
        setSelectedUserId(users.find((u) => u.id !== userId)?.id || null);
      }
    }, 0);
  }, [users]);

  // Roles handlers
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

  const handleSaveRole = useCallback(async (roleData: Partial<Role>) => {
    try {
      if (isRoleEditMode && selectedRole) {
        // Update existing role
        const updatedRole = await updateRole(selectedRole.id, roleData);
        setRoles((prevRoles) =>
          prevRoles.map((r) => (r.id === selectedRole.id ? { ...r, ...roleData, updatedDate: updatedRole.updatedDate } : r))
        );
        message.success('Role updated successfully');
      } else {
        // Create new role
        const newRole = await createRole(roleData as Omit<Role, 'id' | 'createdDate' | 'isDeleted'>);
        setRoles((prevRoles) => [...prevRoles, newRole]);
        message.success('Role created successfully');
      }
      setIsRoleFormVisible(false);
      setSelectedRole(null);
    } catch (error) {
      console.error('Failed to save role:', error);
      message.error('Failed to save role');
    }
  }, [isRoleEditMode, selectedRole]);

  const handleCancelRoleForm = useCallback(() => {
    setIsRoleFormVisible(false);
    setSelectedRole(null);
  }, []);

  const handleDeleteRole = useCallback(async (roleId: string) => {
    try {
      await deleteRole(roleId);
      setRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.id === roleId ? { ...r, isDeleted: true } : r
        )
      );
      message.success('Role deleted successfully');
    } catch (error) {
      console.error('Failed to delete role:', error);
      message.error('Failed to delete role');
    }
  }, []);

  const selectedUser = isAddMode ? null : users.find((u) => u.id === selectedUserId) || null;

  return (
    <div className={styles.container}>
      {/* Left: Security Sub-Navigation Menu */}
      <div className={styles.menuSection}>
        <SubMenu
          selectedMenu={selectedSubMenu}
          onMenuChange={setSelectedSubMenu}
        />
      </div>

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
            roles={roles.filter(r => !r.isDeleted && r.isActive)}
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
    </div>
  );
}
