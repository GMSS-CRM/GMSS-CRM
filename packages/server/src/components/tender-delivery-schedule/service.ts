import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { TenderDeliverySchedule } from '../../entities/TenderDeliverySchedule';
import { ITenderDeliveryScheduleRepository, ITenderDeliveryScheduleService } from './types';

@injectable()
export class TenderDeliveryScheduleService implements ITenderDeliveryScheduleService {
  constructor(
    @inject(TYPES.ITenderDeliveryScheduleRepository)
    private readonly repo: ITenderDeliveryScheduleRepository,
  ) {}

  getByPostAward(postAwardId: string): Promise<TenderDeliverySchedule[]> {
    return this.repo.findByPostAward(postAwardId);
  }

  create(data: Partial<TenderDeliverySchedule>): Promise<TenderDeliverySchedule> {
    return this.repo.createSchedule(data);
  }

  update(id: string, data: Partial<TenderDeliverySchedule>): Promise<TenderDeliverySchedule> {
    return this.repo.updateSchedule(id, data);
  }

  delete(id: string): Promise<void> {
    return this.repo.deleteSchedule(id);
  }
}
