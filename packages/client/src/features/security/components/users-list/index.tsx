import { useState, useMemo, useCallback, memo } from 'react';
import { Input, List, Button, Row, Col, Divider } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { User } from '../../types';
import Avatar from '../../../../components/avatar';
import styles from './styles.module.css';

interface UsersListProps {
  users: User[];
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void;
  onAddUser: () => void;
}

/**
 * Users list component with search and selection
 * Optimized with React.memo and useCallback
 */
function UsersList({
  users,
  selectedUserId,
  onUserSelect,
  onAddUser,
}: UsersListProps) {
  const [searchText, setSearchText] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchText.trim()) return users;
    const query = searchText.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        (user.lastName && user.lastName.toLowerCase().includes(query)) ||
        user.email.toLowerCase().includes(query)
    );
  }, [users, searchText]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleUserClick = useCallback((userId: string) => {
    onUserSelect(userId);
  }, [onUserSelect]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Row gutter={16} align="middle" justify="space-between">
          <Col>
            <div className={styles.title}>Users</div>
            <div className={styles.count}>{users.length} Users</div>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddUser}
              style={{ background: 'var(--accent)', boxShadow: 'none' }}
            />
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '8px 0', borderColor: 'var(--border-color)' }} />

      {/* Search */}
      <Input
        placeholder="Search by name or email address"
        prefix={<SearchOutlined style={{ color: 'var(--accent)', fontSize: 13 }} />}
        value={searchText}
        onChange={handleSearchChange}
        allowClear
        size="small"
        className={styles.searchInput}
      />

      {/* Users List */}
      <List
        itemLayout="horizontal"
        dataSource={filteredUsers}
        className={styles.list}
        renderItem={(user: User) => (
          <div
            key={user.id}
            className={`${styles.listItem} ${
              selectedUserId === user.id ? styles.selected : ''
            }`}
            onClick={() => handleUserClick(user.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleUserClick(user.id);
              }
            }}
          >
            <List.Item className={styles.listItemContent}>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    firstName={user.firstName} 
                    lastName={user.lastName}
                    size={36}
                  />
                }
                title={<div className={styles.userName}>{user.firstName}{user.lastName ? ' ' + user.lastName : ''}</div>}
                description={
                  <div className={styles.userMeta}>
                    <div className={styles.email}>{user.email}</div>
                  </div>
                }
              />
            </List.Item>
          </div>
        )}
      />
    </div>
  );
}

export default memo(UsersList);
