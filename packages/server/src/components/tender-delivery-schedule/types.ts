import { TenderDeliverySchedule } from '../../entities/TenderDeliverySchedule';

export interface ITenderDeliveryScheduleRepository {
  findByPostAward(postAwardId: string): Promise<TenderDeliverySchedule[]>;
  createSchedule(data: Partial<TenderDeliverySchedule>): Promise<TenderDeliverySchedule>;
  updateSchedule(id: string, data: Partial<TenderDeliverySchedule>): Promise<TenderDeliverySchedule>;
  deleteSchedule(id: string): Promise<void>;
}

export interface ITenderDeliveryScheduleService {
  getByPostAward(postAwardId: string): Promise<TenderDeliverySchedule[]>;
  create(data: Partial<TenderDeliverySchedule>): Promise<TenderDeliverySchedule>;
  update(id: string, data: Partial<TenderDeliverySchedule>): Promise<TenderDeliverySchedule>;
  delete(id: string): Promise<void>;
}
