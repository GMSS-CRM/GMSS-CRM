import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { CourierRecord } from '../../entities/CourierRecord';
import { ICourierRecordRepository, ICourierRecordService } from './types';

@injectable()
export class CourierRecordService implements ICourierRecordService {
  constructor(
    @inject(TYPES.ICourierRecordRepository)
    private readonly repo: ICourierRecordRepository,
  ) {}

  getAll(): Promise<CourierRecord[]> {
    return this.repo.findAll();
  }

  getById(id: string): Promise<CourierRecord | null> {
    return this.repo.findById(id);
  }

  getByReference(referenceId: string, referenceType: string): Promise<CourierRecord[]> {
    return this.repo.findByReference(referenceId, referenceType);
  }

  create(data: Partial<CourierRecord>): Promise<CourierRecord> {
    return this.repo.createRecord(data);
  }

  update(id: string, data: Partial<CourierRecord>): Promise<CourierRecord> {
    return this.repo.updateRecord(id, data);
  }

  delete(id: string): Promise<void> {
    return this.repo.deleteRecord(id);
  }
}
