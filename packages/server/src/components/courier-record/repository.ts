import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { CourierRecord } from '../../entities/CourierRecord';
import { ICourierRecordRepository } from './types';

@injectable()
export class CourierRecordRepository
  extends Repository<CourierRecord>
  implements ICourierRecordRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(CourierRecord, db.manager);
  }

  findAll(): Promise<CourierRecord[]> {
    return this.find({ order: { createdDate: 'DESC' } });
  }

  findById(id: string): Promise<CourierRecord | null> {
    return this.findOneBy({ id });
  }

  findByReference(referenceId: string, referenceType: string): Promise<CourierRecord[]> {
    return this.find({
      where: { referenceId, referenceType },
      order: { createdDate: 'DESC' },
    });
  }

  async createRecord(data: Partial<CourierRecord>): Promise<CourierRecord> {
    return this.save(this.create(data));
  }

  async updateRecord(id: string, data: Partial<CourierRecord>): Promise<CourierRecord> {
    await this.update(id, data);
    return this.findOneByOrFail({ id });
  }

  async deleteRecord(id: string): Promise<void> {
    await this.delete(id);
  }
}
