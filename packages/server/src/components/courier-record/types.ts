import { CourierRecord } from '../../entities/CourierRecord';

export interface ICourierRecordRepository {
  findAll(): Promise<CourierRecord[]>;
  findById(id: string): Promise<CourierRecord | null>;
  findByReference(referenceId: string, referenceType: string): Promise<CourierRecord[]>;
  createRecord(data: Partial<CourierRecord>): Promise<CourierRecord>;
  updateRecord(id: string, data: Partial<CourierRecord>): Promise<CourierRecord>;
  deleteRecord(id: string): Promise<void>;
}

export interface ICourierRecordService {
  getAll(): Promise<CourierRecord[]>;
  getById(id: string): Promise<CourierRecord | null>;
  getByReference(referenceId: string, referenceType: string): Promise<CourierRecord[]>;
  create(data: Partial<CourierRecord>): Promise<CourierRecord>;
  update(id: string, data: Partial<CourierRecord>): Promise<CourierRecord>;
  delete(id: string): Promise<void>;
}
