import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { TenderActivityLog } from '../../entities/TenderActivityLog';
import { ITenderActivityLogRepository } from './types';

@injectable()
export class TenderActivityLogRepository
  extends Repository<TenderActivityLog>
  implements ITenderActivityLogRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(TenderActivityLog, db.manager);
  }

  findByTenderId(tenderId: string): Promise<TenderActivityLog[]> {
    return this.find({
      where: { tenderId },
      order: { createdDate: 'DESC' },
    });
  }

  async logActivity(data: Partial<TenderActivityLog>): Promise<TenderActivityLog> {
    return this.save(this.create(data));
  }
}
