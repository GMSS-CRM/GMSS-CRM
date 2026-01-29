import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorTag } from '../../entities/VendorTag';
import { IVendorTagRepository } from './types';

@injectable()
export class VendorTagRepository extends Repository<VendorTag> implements IVendorTagRepository {
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(VendorTag, dbContext.manager);
  }

  createVendorTag(data: any) {
    return this.save(this.create(data));
  }

  findById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['tag'],
    });
  }

  deleteVendorTag(id: string) {
    return this.delete({ id });
  }

  deleteVendorTagsByVendorId(vendorId: string) {
    return this.delete({ vendorId });
  }

  async findVendorsByTagId(tagId: string) {
    return this.createQueryBuilder('vendorTag')
      .where('vendorTag.tagId = :tagId', { tagId })
      .leftJoinAndSelect('vendorTag.vendor', 'vendor')
      .select('vendor')
      .getMany()
      .then((results) => results.map((vt) => vt.vendor));
  }
}
