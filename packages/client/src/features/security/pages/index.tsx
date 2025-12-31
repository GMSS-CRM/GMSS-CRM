import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import SubMenu from '../../../components/sub-menu';
import type { SubMenuItem } from '../../../components/sub-menu';
import UsersList from './users/list';
import UserDetailsForm from './users/details-form';
import type { User, Role } from '../types';
import styles from './index.module.css';

/**
 * Mock data - In production, this would come from an API
 */
const MOCK_ROLES: Role[] = [
  { id: '1', name: 'Member', description: 'Basic team member access' },
  { id: '2', name: 'Manager', description: 'Team management access' },
  { id: '3', name: 'Director', description: 'Department director access' },
  { id: '4', name: 'System Administrator', description: 'Full system access' },
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
 * Three-section layout: Menu | Users List | User Details
 */
export default function SecurityPage() {
  const [selectedSubMenu, setSelectedSubMenu] = useState<SubMenuItem>('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Auto-select first user on mount
  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setIsAddMode(false);
  }, []);

  const handleSaveUser = useCallback((updatedUser: User) => {
    setUsers((prevUsers) => {
      const existingIndex = prevUsers.findIndex((u) => u.id === updatedUser.id);
      if (existingIndex >= 0) {
        // Update existing user
        const newUsers = [...prevUsers];
        newUsers[existingIndex] = updatedUser;
        return newUsers;
      } else {
        // Add new user
        return [...prevUsers, updatedUser];
      }
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
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
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
            roles={MOCK_ROLES}
            isAddMode={isAddMode}
          />
        </div>
      )}

      {/* Placeholder for other menu items */}
      {selectedSubMenu !== 'users' && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            fontSize: 16,
            color: 'var(--text-secondary)',
          }}
        >
          {selectedSubMenu.charAt(0).toUpperCase() + selectedSubMenu.slice(1)} section coming soon
        </div>
      )}
    </div>
  );
}
