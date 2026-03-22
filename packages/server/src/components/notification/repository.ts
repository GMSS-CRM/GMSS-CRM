import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Notification } from '../../entities/Notification';
import { INotificationRepository } from './types';

@injectable()
export class NotificationRepository
  extends Repository<Notification>
  implements INotificationRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(Notification, db.manager);
  }

  findByUserId(userId?: string): Promise<Notification[]> {
    return this.find({
      where: { ...(userId ? { userId } : {}), isDismissed: false },
      order: { createdDate: 'DESC' },
      take: 50,
    });
  }

  async countUnread(userId?: string): Promise<number> {
    return this.count({
      where: { ...(userId ? { userId } : {}), isRead: false, isDismissed: false },
    });
  }

  async createAndSave(data: Partial<Notification>): Promise<Notification> {
    return this.save(super.create(data));
  }

  async markRead(id: string): Promise<Notification> {
    await this.update(id, { isRead: true });
    return this.findOneByOrFail({ id });
  }

  async markAllRead(userId?: string): Promise<void> {
    await this.update(
      { ...(userId ? { userId } : {}), isRead: false },
      { isRead: true },
    );
  }

  async dismiss(id: string): Promise<void> {
    await this.update(id, { isDismissed: true });
  }
}
