import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { TagAutoMailRestriction } from '../../entities/TagAutoMailRestriction';
import { ITagAutoMailRestrictionRepository } from './types';

@injectable()
export class TagAutoMailRestrictionRepository
  extends Repository<TagAutoMailRestriction>
  implements ITagAutoMailRestrictionRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(TagAutoMailRestriction, db.manager);
  }

  findByTag(tagId: string): Promise<TagAutoMailRestriction[]> {
    return this.find({
      where: { tagId },
      order: { createdDate: 'DESC' },
    });
  }

  findByVendor(vendorId: string): Promise<TagAutoMailRestriction[]> {
    return this.find({
      where: { vendorId },
      order: { createdDate: 'DESC' },
    });
  }

  async createRestriction(data: Partial<TagAutoMailRestriction>): Promise<TagAutoMailRestriction> {
    return this.save(this.create(data));
  }

  async deleteRestriction(id: string): Promise<void> {
    await this.delete(id);
  }

  async deleteByTagAndVendor(tagId: string, vendorId: string): Promise<void> {
    await this.delete({ tagId, vendorId });
  }
}
