import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { TagAutoMailRestriction } from '../../entities/TagAutoMailRestriction';
import { ITagAutoMailRestrictionRepository, ITagAutoMailRestrictionService } from './types';

@injectable()
export class TagAutoMailRestrictionService implements ITagAutoMailRestrictionService {
  constructor(
    @inject(TYPES.ITagAutoMailRestrictionRepository)
    private readonly repo: ITagAutoMailRestrictionRepository,
  ) {}

  getByTag(tagId: string): Promise<TagAutoMailRestriction[]> {
    return this.repo.findByTag(tagId);
  }

  getByVendor(vendorId: string): Promise<TagAutoMailRestriction[]> {
    return this.repo.findByVendor(vendorId);
  }

  create(tagId: string, vendorId: string): Promise<TagAutoMailRestriction> {
    return this.repo.createRestriction({ tagId, vendorId });
  }

  delete(id: string): Promise<void> {
    return this.repo.deleteRestriction(id);
  }

  deleteByTagAndVendor(tagId: string, vendorId: string): Promise<void> {
    return this.repo.deleteByTagAndVendor(tagId, vendorId);
  }
}
