import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { TenderDeliverySchedule } from '../../entities/TenderDeliverySchedule';
import { ITenderDeliveryScheduleRepository } from './types';

@injectable()
export class TenderDeliveryScheduleRepository
  extends Repository<TenderDeliverySchedule>
  implements ITenderDeliveryScheduleRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(TenderDeliverySchedule, db.manager);
  }

  findByPostAward(postAwardId: string): Promise<TenderDeliverySchedule[]> {
    return this.find({
      where: { postAwardId },
      order: { scheduledDate: 'ASC' },
    });
  }

  async createSchedule(data: Partial<TenderDeliverySchedule>): Promise<TenderDeliverySchedule> {
    return this.save(this.create(data));
  }

  async updateSchedule(id: string, data: Partial<TenderDeliverySchedule>): Promise<TenderDeliverySchedule> {
    await this.update(id, data);
    return this.findOneByOrFail({ id });
  }

  async deleteSchedule(id: string): Promise<void> {
    await this.delete(id);
  }
}
