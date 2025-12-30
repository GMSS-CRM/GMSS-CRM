import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import SecurityMenu from '../components/SecurityMenu';
import UsersList from '../components/UsersList';
import UserDetailsForm from '../components/UserDetailsForm';
import type { User, SecurityMenuItem, Role, Restriction } from '../types';
import styles from './SecurityPage.module.css';

/**
 * Mock data - In production, this would come from an API
 */
const MOCK_ROLES: Role[] = [
  { id: '1', name: 'Approver', description: 'Can approve requests' },
  { id: '2', name: 'Construction', description: 'Construction team' },
  { id: '3', name: 'Electrical', description: 'Electrical team' },
  { id: '4', name: 'Satellite Power User', description: 'Satellite power access' },
  { id: '5', name: 'System Administrator', description: 'Full system access' },
];

const MOCK_RESTRICTIONS: Restriction[] = [
  { id: '1', name: 'Equipment Tag', type: 'EquipmentTag' },
  { id: '2', name: 'Location A', type: 'Location' },
  { id: '3', name: 'Department X', type: 'Department' },
];

const MOCK_USERS: User[] = [
  { id: '1', firstName: 'Rajesh', lastName: 'Kumar', email: 'rkumar@gmss.com', roles: ['1', '2', '3'], restrictions: ['1'], isActive: true, roleCount: 3 },
  { id: '2', firstName: 'Priya', lastName: 'Singh', email: 'psingh@gmss.com', roles: ['2', '3', '4'], restrictions: ['2'], isActive: true, roleCount: 3 },
  { id: '3', firstName: 'Amit', lastName: 'Verma', email: 'averma@gmss.com', roles: ['1', '5'], restrictions: [], isActive: true, roleCount: 2 },
  { id: '4', firstName: 'Neha', lastName: 'Patel', email: 'npatel@gmss.com', roles: ['2', '3', '4', '5'], restrictions: ['1', '2'], isActive: true, roleCount: 4 },
  { id: '5', firstName: 'Vikram', lastName: 'Shrivastav', email: 'vshrivastav@gmss.com', roles: ['1', '2', '3', '4', '5'], restrictions: [], isActive: true, roleCount: 5 },
  { id: '6', firstName: 'Anjali', lastName: 'Sharma', email: 'asharma@gmss.com', roles: ['3', '4'], restrictions: ['2'], isActive: true, roleCount: 2 },
  { id: '7', firstName: 'Arjun', lastName: 'Nair', email: 'anair@gmss.com', roles: ['1', '2'], restrictions: [], isActive: true, roleCount: 2 },
  { id: '8', firstName: 'Sneha', lastName: 'Gupta', email: 'sgupta@gmss.com', roles: ['2', '3', '5'], restrictions: ['1'], isActive: false, roleCount: 3 },
  { id: '9', firstName: 'Rohit', lastName: 'Desai', email: 'rdesai@gmss.com', roles: ['1', '2', '3', '4'], restrictions: ['2', '3'], isActive: true, roleCount: 4 },
  { id: '10', firstName: 'Divya', lastName: 'Rao', email: 'drao@gmss.com', roles: ['1', '5'], restrictions: [], isActive: true, roleCount: 2 },
];

/**
 * Main Security Page component
 * Three-section layout: Menu | Users List | User Details
 */
export default function SecurityPage() {
  const [selectedSecurityMenu, setSelectedSecurityMenu] = useState<SecurityMenuItem>('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Auto-select first user on mount
  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const handleSaveUser = useCallback((updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    message.success('User updated successfully');
  }, []);

  const handleCancelEdit = useCallback(() => {
    // Reset by re-selecting (triggers form refresh)
    if (selectedUserId) setSelectedUserId(selectedUserId);
  }, [selectedUserId]);

  const handleAddUser = useCallback(() => {
    message.info('Add user feature coming soon');
  }, []);

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  return (
    <div className={styles.container}>
      {/* Left: Security Sub-Navigation Menu */}
      <div className={styles.menuSection}>
        <SecurityMenu
          selectedMenu={selectedSecurityMenu}
          onMenuChange={setSelectedSecurityMenu}
        />
      </div>

      {/* Center: Users List */}
      {selectedSecurityMenu === 'users' && (
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
      {selectedSecurityMenu === 'users' && (
        <div className={styles.formSection}>
          <UserDetailsForm
            user={selectedUser}
            onSave={handleSaveUser}
            onCancel={handleCancelEdit}
            roles={MOCK_ROLES}
            restrictions={MOCK_RESTRICTIONS}
          />
        </div>
      )}

      {/* Placeholder for other menu items */}
      {selectedSecurityMenu !== 'users' && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            fontSize: 16,
            color: '#8c8c8c',
          }}
        >
          {selectedSecurityMenu.charAt(0).toUpperCase() + selectedSecurityMenu.slice(1)} section coming soon
        </div>
      )}
    </div>
  );
}
