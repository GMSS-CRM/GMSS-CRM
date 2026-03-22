import { TagAutoMailRestriction } from '../../entities/TagAutoMailRestriction';

export interface ITagAutoMailRestrictionRepository {
  findByTag(tagId: string): Promise<TagAutoMailRestriction[]>;
  findByVendor(vendorId: string): Promise<TagAutoMailRestriction[]>;
  createRestriction(data: Partial<TagAutoMailRestriction>): Promise<TagAutoMailRestriction>;
  deleteRestriction(id: string): Promise<void>;
  deleteByTagAndVendor(tagId: string, vendorId: string): Promise<void>;
}

export interface ITagAutoMailRestrictionService {
  getByTag(tagId: string): Promise<TagAutoMailRestriction[]>;
  getByVendor(vendorId: string): Promise<TagAutoMailRestriction[]>;
  create(tagId: string, vendorId: string): Promise<TagAutoMailRestriction>;
  delete(id: string): Promise<void>;
  deleteByTagAndVendor(tagId: string, vendorId: string): Promise<void>;
}
