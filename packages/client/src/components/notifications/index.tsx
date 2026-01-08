import { useState, useMemo } from 'react';
import { Dropdown, Badge, Tabs, Empty, Avatar } from 'antd';
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
  FileTextOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import Button from '../button';
import styles from './styles.module.css';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'user' | 'document';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'user',
    title: 'New User Added',
    message: 'Rajesh Kumar has been added to the system',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Role Updated',
    message: 'Manager role permissions have been updated successfully',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected for user account',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    isRead: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur on Sunday at 2:00 AM',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    isRead: true,
  },
  {
    id: '5',
    type: 'document',
    title: 'New Report Available',
    message: 'Monthly analytics report is ready for download',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    isRead: true,
  },
];

export default function     NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter(n => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconMap = {
      info: <InfoCircleOutlined className={styles.iconInfo} />,
      success: <CheckCircleOutlined className={styles.iconSuccess} />,
      warning: <WarningOutlined className={styles.iconWarning} />,
      user: <UserAddOutlined className={styles.iconUser} />,
      document: <FileTextOutlined className={styles.iconDocument} />,
    };
    return iconMap[type];
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const dropdownContent = (
    <div className={styles.dropdownContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <BellOutlined className={styles.headerIcon} />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <Button
              variant="text"
              size="small"
              onClick={markAllAsRead}
              className={styles.actionButton}
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="text"
              size="small"
              onClick={clearAll}
              className={styles.actionButton}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className={styles.tabs}
        items={[
          {
            key: 'all',
            label: `All (${notifications.length})`,
          },
          {
            key: 'unread',
            label: `Unread (${unreadCount})`,
          },
        ]}
      />

      {/* Notifications List */}
      <div className={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              activeTab === 'unread' ? 'No unread notifications' : 'No notifications'
            }
            className={styles.empty}
          />
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${
                !notification.isRead ? styles.unread : ''
              }`}
            >
              {/* Unread Indicator */}
              {!notification.isRead && <div className={styles.unreadDot} />}

              {/* Icon */}
              <div className={styles.notificationIcon}>
                {notification.avatar ? (
                  <Avatar src={notification.avatar} size={40} />
                ) : (
                  getNotificationIcon(notification.type)
                )}
              </div>

              {/* Content */}
              <div className={styles.notificationContent}>
                <div className={styles.notificationTitle}>
                  {notification.title}
                </div>
                <div className={styles.notificationMessage}>
                  {notification.message}
                </div>
                <div className={styles.notificationTime}>
                  {getRelativeTime(notification.timestamp)}
                </div>
              </div>

              {/* Actions */}
              <div className={styles.notificationActions}>
                {!notification.isRead && (
                  <Button
                    variant="text"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={(e) => markAsRead(notification.id, e)}
                    className={styles.iconButton}
                    title="Mark as read"
                  />
                )}
                <Button
                  variant="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={(e) => removeNotification(notification.id, e)}
                  className={styles.iconButton}
                  title="Remove"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className={styles.footer}>
          <Button variant="text" size="small" className={styles.viewAllButton}>
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      overlayClassName={styles.notificationDropdown}
    >
      <Badge 
        count={unreadCount} 
        size="small" 
        offset={[-4, 4]}
        className={styles.badge}
      >
        <Button
          variant="text"
          icon={
            <BellOutlined
              className={`${styles.bellIcon} ${unreadCount > 0 ? styles.hasNotifications : ''}`}
            />
          }
          className={styles.notificationButton}
        />
      </Badge>
    </Dropdown>
  );
}
