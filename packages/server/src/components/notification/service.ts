import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { Notification } from '../../entities/Notification';
import { INotificationRepository, INotificationService } from './types';

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepository)
    private readonly repo: INotificationRepository,
  ) {}

  getByUserId(userId?: string): Promise<Notification[]> {
    return this.repo.findByUserId(userId);
  }

  getUnreadCount(userId?: string): Promise<number> {
    return this.repo.countUnread(userId);
  }

  async createAndSave(data: Partial<Notification>): Promise<Notification> {
    return this.repo.createAndSave(data);
  }

  markRead(id: string): Promise<Notification> {
    return this.repo.markRead(id);
  }

  markAllRead(userId?: string): Promise<void> {
    return this.repo.markAllRead(userId);
  }

  dismiss(id: string): Promise<void> {
    return this.repo.dismiss(id);
  }
}
