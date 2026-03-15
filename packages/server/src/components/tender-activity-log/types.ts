import { TenderActivityLog } from '../../entities/TenderActivityLog';

export interface ITenderActivityLogRepository {
  findByTenderId(tenderId: string): Promise<TenderActivityLog[]>;
  logActivity(data: Partial<TenderActivityLog>): Promise<TenderActivityLog>;
}

export interface ITenderActivityLogService {
  getByTenderId(tenderId: string): Promise<TenderActivityLog[]>;
  log(
    tenderId: string,
    action: string,
    description: string,
    performedBy?: string,
    metadata?: Record<string, unknown>,
  ): Promise<TenderActivityLog>;
}
