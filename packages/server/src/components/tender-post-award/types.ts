import { TenderPostAward } from '../../entities/TenderPostAward';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';

export interface ITenderPostAwardRepository {
  findByTenderId(tenderId: string): Promise<TenderPostAward | null>;
  saveStageData(tenderId: string, data: Partial<TenderPostAward>): Promise<TenderPostAward>;
}

export interface ITenderPostAwardService {
  getOrCreate(tenderId: string): Promise<TenderPostAward>;
  updateStage(tenderId: string, stage: PostAwardStage, data: Partial<TenderPostAward>): Promise<TenderPostAward>;
  advanceStage(tenderId: string): Promise<TenderPostAward>;
}
