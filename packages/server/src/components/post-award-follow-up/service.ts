import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { PostAwardFollowUp } from '../../entities/PostAwardFollowUp';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';
import { IPostAwardFollowUpRepository, IPostAwardFollowUpService } from './types';

/** Default follow-up interval in days (5–7 day range, using 7 as default) */
const DEFAULT_FOLLOWUP_INTERVAL_DAYS = 7;

@injectable()
export class PostAwardFollowUpService implements IPostAwardFollowUpService {
  constructor(
    @inject(TYPES.IPostAwardFollowUpRepository)
    private readonly repo: IPostAwardFollowUpRepository,
  ) {}

  getByPostAwardId(postAwardId: string): Promise<PostAwardFollowUp[]> {
    return this.repo.findByPostAwardId(postAwardId);
  }

  getByTenderId(tenderId: string): Promise<PostAwardFollowUp[]> {
    return this.repo.findByTenderId(tenderId);
  }

  getByStage(postAwardId: string, stage: PostAwardStage): Promise<PostAwardFollowUp[]> {
    return this.repo.findByStage(postAwardId, stage);
  }

  getPending(): Promise<PostAwardFollowUp[]> {
    return this.repo.findPending();
  }

  getOverdue(): Promise<PostAwardFollowUp[]> {
    return this.repo.findOverdue();
  }

  async create(data: Partial<PostAwardFollowUp>): Promise<PostAwardFollowUp> {
    // Auto-set next follow-up date if not provided
    if (!data.nextFollowUpDate && data.followUpDate) {
      const next = new Date(data.followUpDate);
      next.setDate(next.getDate() + DEFAULT_FOLLOWUP_INTERVAL_DAYS);
      data.nextFollowUpDate = next;
    }
    return this.repo.createFollowUp(data);
  }

  async update(id: string, data: Partial<PostAwardFollowUp>): Promise<PostAwardFollowUp> {
    return this.repo.updateFollowUp(id, data);
  }

  async complete(id: string, outcome: string): Promise<PostAwardFollowUp> {
    return this.repo.updateFollowUp(id, {
      isCompleted: true,
      outcome,
    });
  }
}
