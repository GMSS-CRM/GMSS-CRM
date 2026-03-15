import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { TenderActivityLog } from '../../entities/TenderActivityLog';
import { ITenderActivityLogRepository, ITenderActivityLogService } from './types';

@injectable()
export class TenderActivityLogService implements ITenderActivityLogService {
  constructor(
    @inject(TYPES.ITenderActivityLogRepository)
    private readonly repo: ITenderActivityLogRepository,
  ) {}

  getByTenderId(tenderId: string): Promise<TenderActivityLog[]> {
    return this.repo.findByTenderId(tenderId);
  }

  async log(
    tenderId: string,
    action: string,
    description: string,
    performedBy = 'SYSTEM',
    metadata?: Record<string, unknown>,
  ): Promise<TenderActivityLog> {
    return this.repo.logActivity({
      tenderId,
      action,
      description,
      performedBy,
      metadata,
    });
  }
}
