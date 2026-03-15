import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { TenderPostAward } from '../../entities/TenderPostAward';
import { ITenderPostAwardRepository } from './types';

@injectable()
export class TenderPostAwardRepository
  extends Repository<TenderPostAward>
  implements ITenderPostAwardRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(TenderPostAward, db.manager);
  }

  findByTenderId(tenderId: string): Promise<TenderPostAward | null> {
    return this.findOne({ where: { tenderId } });
  }

  async saveStageData(tenderId: string, data: Partial<TenderPostAward>): Promise<TenderPostAward> {
    const existing = await this.findByTenderId(tenderId);
    if (existing) {
      await this.update(existing.id, data);
      return (await this.findByTenderId(tenderId))!;
    }
    return this.save(this.create({ tenderId, ...data }));
  }
}
