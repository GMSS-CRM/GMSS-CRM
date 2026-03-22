import { useState, useMemo } from 'react';
import { Dropdown, Badge, Tabs, Empty, Spin } from 'antd';
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  WarningOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CloseOutlined,
  CheckOutlined,
  DollarOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { NotificationType } from '@gmss/types';
import Button from '../button';
import { useNotifications } from './service';
import styles from './styles.module.css';

const ICON_MAP: Record<string, { icon: React.ReactNode; className: string }> = {
  [NotificationType.PAYMENT_DUE]: { icon: <DollarOutlined />, className: styles.iconWarning },
  [NotificationType.SD_RELEASE]: { icon: <SafetyOutlined />, className: styles.iconSuccess },
  [NotificationType.DOCUMENT_EXPIRY]: { icon: <FileTextOutlined />, className: styles.iconWarning },
  [NotificationType.AGREEMENT_RENEWAL]: { icon: <FileTextOutlined />, className: styles.iconInfo },
  [NotificationType.FOLLOW_UP_DUE]: { icon: <ClockCircleOutlined />, className: styles.iconWarning },
  [NotificationType.TENDER_DEADLINE]: { icon: <WarningOutlined />, className: styles.iconWarning },
  [NotificationType.TASK_ASSIGNED]: { icon: <CheckCircleOutlined />, className: styles.iconUser },
  [NotificationType.GENERAL]: { icon: <InfoCircleOutlined />, className: styles.iconInfo },
};

export default function NotificationDropdown() {
  const { notifications, unreadCount, loading, markRead, markAllRead, dismiss } = useNotifications();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter(n => !n.isRead);
    }
    return notifications;
  }, [notifications, activeTab]);

  const getNotificationIcon = (type: string) => {
    const entry = ICON_MAP[type] ?? ICON_MAP[NotificationType.GENERAL];
    return <span className={entry.className}>{entry.icon}</span>;
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

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markRead(id);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dismiss(id);
  };

  const handleMarkAllAsRead = () => {
    markAllRead();
  };

  const handleClearAll = () => {
    notifications.forEach(n => dismiss(n.id));
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
              onClick={handleMarkAllAsRead}
              className={styles.actionButton}
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="text"
              size="small"
              onClick={handleClearAll}
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
        {loading ? (
          <div className={styles.empty}><Spin /></div>
        ) : filteredNotifications.length === 0 ? (
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
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className={styles.notificationContent}>
                <div className={styles.notificationTitle}>
                  {notification.title}
                </div>
                <div className={styles.notificationMessage}>
                  {notification.body}
                </div>
                <div className={styles.notificationTime}>
                  {getRelativeTime(notification.createdDate)}
                </div>
              </div>

              {/* Actions */}
              <div className={styles.notificationActions}>
                {!notification.isRead && (
                  <Button
                    variant="text"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                    className={styles.iconButton}
                    title="Mark as read"
                  />
                )}
                <Button
                  variant="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={(e) => handleRemove(notification.id, e)}
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
