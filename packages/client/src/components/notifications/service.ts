import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import type { Notification } from '@gmss/types';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: String) {
    getNotifications(userId: $userId) {
      id
      userId
      type
      title
      body
      referenceId
      referenceType
      isRead
      isDismissed
      createdDate
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadNotificationCount($userId: String) {
    getUnreadNotificationCount(userId: $userId)
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      isRead
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead($userId: String) {
    markAllNotificationsRead(userId: $userId)
  }
`;

export const DISMISS_NOTIFICATION = gql`
  mutation DismissNotification($id: ID!) {
    dismissNotification(id: $id)
  }
`;

export function useNotifications(userId?: string) {
  const { data, loading, refetch } = useQuery<{ getNotifications: Notification[] }>(
    GET_NOTIFICATIONS,
    {
      variables: { userId },
      pollInterval: 30000, // Poll every 30s for new notifications
    },
  );

  const { data: countData } = useQuery<{ getUnreadNotificationCount: number }>(
    GET_UNREAD_COUNT,
    {
      variables: { userId },
      pollInterval: 30000,
    },
  );

  const [markRead] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries: [
      { query: GET_NOTIFICATIONS, variables: { userId } },
      { query: GET_UNREAD_COUNT, variables: { userId } },
    ],
  });

  const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries: [
      { query: GET_NOTIFICATIONS, variables: { userId } },
      { query: GET_UNREAD_COUNT, variables: { userId } },
    ],
  });

  const [dismiss] = useMutation(DISMISS_NOTIFICATION, {
    refetchQueries: [
      { query: GET_NOTIFICATIONS, variables: { userId } },
      { query: GET_UNREAD_COUNT, variables: { userId } },
    ],
  });

  return {
    notifications: data?.getNotifications ?? [],
    unreadCount: countData?.getUnreadNotificationCount ?? 0,
    loading,
    refetch,
    markRead: (id: string) => markRead({ variables: { id } }),
    markAllRead: () => markAllRead({ variables: { userId } }),
    dismiss: (id: string) => dismiss({ variables: { id } }),
  };
}
