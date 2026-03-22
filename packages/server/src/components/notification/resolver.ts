import { getContainer } from '../../inversify/container';
import { TYPES } from '../../inversify/types';
import { INotificationService } from './types';

function getService(): INotificationService {
  return getContainer().get<INotificationService>(TYPES.INotificationService);
}

export const notificationResolvers = {
  Query: {
    getNotifications: (_: unknown, { userId }: { userId?: string }) =>
      getService().getByUserId(userId),
    getUnreadNotificationCount: (_: unknown, { userId }: { userId?: string }) =>
      getService().getUnreadCount(userId),
  },

  Mutation: {
    createNotification: (
      _: unknown,
      args: { userId?: string; type: string; title: string; body?: string; referenceId?: string; referenceType?: string },
    ) => getService().createAndSave(args as any),

    markNotificationRead: (_: unknown, { id }: { id: string }) =>
      getService().markRead(id),

    markAllNotificationsRead: async (_: unknown, { userId }: { userId?: string }) => {
      await getService().markAllRead(userId);
      return true;
    },

    dismissNotification: async (_: unknown, { id }: { id: string }) => {
      await getService().dismiss(id);
      return true;
    },
  },

  Notification: {
    createdDate: (parent: any) =>
      parent.createdDate instanceof Date
        ? parent.createdDate.toISOString()
        : parent.createdDate,
  },
};
