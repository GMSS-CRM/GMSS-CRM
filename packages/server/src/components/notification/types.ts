import { Notification } from '../../entities/Notification';

export interface INotificationRepository {
  findByUserId(userId?: string): Promise<Notification[]>;
  countUnread(userId?: string): Promise<number>;
  createAndSave(data: Partial<Notification>): Promise<Notification>;
  markRead(id: string): Promise<Notification>;
  markAllRead(userId?: string): Promise<void>;
  dismiss(id: string): Promise<void>;
}

export interface INotificationService {
  getByUserId(userId?: string): Promise<Notification[]>;
  getUnreadCount(userId?: string): Promise<number>;
  createAndSave(data: Partial<Notification>): Promise<Notification>;
  markRead(id: string): Promise<Notification>;
  markAllRead(userId?: string): Promise<void>;
  dismiss(id: string): Promise<void>;
}
