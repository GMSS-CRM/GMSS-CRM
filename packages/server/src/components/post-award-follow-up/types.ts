import { PostAwardFollowUp } from '../../entities/PostAwardFollowUp';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';

export interface IPostAwardFollowUpRepository {
  findByPostAwardId(postAwardId: string): Promise<PostAwardFollowUp[]>;
  findByTenderId(tenderId: string): Promise<PostAwardFollowUp[]>;
  findByStage(postAwardId: string, stage: PostAwardStage): Promise<PostAwardFollowUp[]>;
  findPending(): Promise<PostAwardFollowUp[]>;
  findOverdue(): Promise<PostAwardFollowUp[]>;
  createFollowUp(data: Partial<PostAwardFollowUp>): Promise<PostAwardFollowUp>;
  updateFollowUp(id: string, data: Partial<PostAwardFollowUp>): Promise<PostAwardFollowUp>;
}

export interface IPostAwardFollowUpService {
  getByPostAwardId(postAwardId: string): Promise<PostAwardFollowUp[]>;
  getByTenderId(tenderId: string): Promise<PostAwardFollowUp[]>;
  getByStage(postAwardId: string, stage: PostAwardStage): Promise<PostAwardFollowUp[]>;
  getPending(): Promise<PostAwardFollowUp[]>;
  getOverdue(): Promise<PostAwardFollowUp[]>;
  create(data: Partial<PostAwardFollowUp>): Promise<PostAwardFollowUp>;
  update(id: string, data: Partial<PostAwardFollowUp>): Promise<PostAwardFollowUp>;
  complete(id: string, outcome: string): Promise<PostAwardFollowUp>;
}
