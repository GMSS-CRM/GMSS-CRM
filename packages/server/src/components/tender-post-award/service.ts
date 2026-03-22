import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { TenderPostAward } from '../../entities/TenderPostAward';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';
import { ITenderPostAwardRepository, ITenderPostAwardService } from './types';

const STAGE_ORDER: PostAwardStage[] = [
  PostAwardStage.ORDER_FOLLOWUP,
  PostAwardStage.LOA_PROCESSING,
  PostAwardStage.ORDER_PROCESSING,
  PostAwardStage.INSPECTION,
  PostAwardStage.DISPATCH_DELIVERY,
  PostAwardStage.WARRANTY,
  PostAwardStage.BILL_PAYMENT,
  PostAwardStage.SD_RETURN,
  PostAwardStage.CLOSED,
];

@injectable()
export class TenderPostAwardService implements ITenderPostAwardService {
  constructor(
    @inject(TYPES.ITenderPostAwardRepository)
    private readonly repo: ITenderPostAwardRepository,
  ) {}

  async get(tenderId: string): Promise<TenderPostAward | null> {
    return this.repo.findByTenderId(tenderId);
  }

  async getOrCreate(tenderId: string): Promise<TenderPostAward> {
    const existing = await this.repo.findByTenderId(tenderId);
    if (existing) return existing;
    return this.repo.saveStageData(tenderId, { currentStage: PostAwardStage.ORDER_FOLLOWUP });
  }

  async updateStage(
    tenderId: string,
    stage: PostAwardStage,
    data: Partial<TenderPostAward>,
  ): Promise<TenderPostAward> {
    return this.repo.saveStageData(tenderId, { ...data, currentStage: stage });
  }

  async advanceStage(tenderId: string): Promise<TenderPostAward> {
    const record = await this.getOrCreate(tenderId);
    const currentIdx = STAGE_ORDER.indexOf(record.currentStage);
    const nextStage = STAGE_ORDER[Math.min(currentIdx + 1, STAGE_ORDER.length - 1)];
    return this.repo.saveStageData(tenderId, { currentStage: nextStage });
  }

  async revertStage(tenderId: string): Promise<TenderPostAward> {
    const record = await this.getOrCreate(tenderId);
    const currentIdx = STAGE_ORDER.indexOf(record.currentStage);
    const prevStage = STAGE_ORDER[Math.max(currentIdx - 1, 0)];
    return this.repo.saveStageData(tenderId, { currentStage: prevStage });
  }

  async setWinningVendor(tenderId: string, vendorId: string): Promise<TenderPostAward> {
    return this.repo.saveStageData(tenderId, { winningVendorId: vendorId });
  }
}
