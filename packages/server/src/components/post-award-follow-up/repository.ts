import { inject, injectable } from 'inversify';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { PostAwardFollowUp } from '../../entities/PostAwardFollowUp';
import { PostAwardStage } from '../../entities/enums/PostAwardStage';
import { IPostAwardFollowUpRepository } from './types';

@injectable()
export class PostAwardFollowUpRepository
  extends Repository<PostAwardFollowUp>
  implements IPostAwardFollowUpRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(PostAwardFollowUp, db.manager);
  }

  findByPostAwardId(postAwardId: string): Promise<PostAwardFollowUp[]> {
    return this.find({
      where: { postAwardId },
      order: { createdDate: 'DESC' },
    });
  }

  findByTenderId(tenderId: string): Promise<PostAwardFollowUp[]> {
    return this.find({
      where: { tenderId },
      order: { createdDate: 'DESC' },
    });
  }

  findByStage(postAwardId: string, stage: PostAwardStage): Promise<PostAwardFollowUp[]> {
    return this.find({
      where: { postAwardId, stage },
      order: { createdDate: 'DESC' },
    });
  }

  findPending(): Promise<PostAwardFollowUp[]> {
    return this.find({
      where: { isCompleted: false },
      order: { nextFollowUpDate: 'ASC' },
    });
  }

  findOverdue(): Promise<PostAwardFollowUp[]> {
    return this.find({
      where: {
        isCompleted: false,
        nextFollowUpDate: LessThanOrEqual(new Date()),
      },
      order: { nextFollowUpDate: 'ASC' },
    });
  }

  async createFollowUp(data: Partial<PostAwardFollowUp>): Promise<PostAwardFollowUp> {
    return this.save(this.create(data));
  }

  async updateFollowUp(id: string, data: Partial<PostAwardFollowUp>): Promise<PostAwardFollowUp> {
    await this.update(id, data);
    const updated = await this.findOne({ where: { id } });
    if (!updated) throw new Error('PostAwardFollowUp not found after update');
    return updated;
  }
}
