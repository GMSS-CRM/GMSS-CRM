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
      .leftJoinAndSelect('vendor.contactPersons', 'contactPersons')
      .leftJoinAndSelect('vendor.tags', 'tags')
      .select([
        'vendorTag.id',
        'vendorTag.vendorId',
        'vendorTag.id',
        'vendorTag.vendorId',
        'vendor.id',
        'vendor.name',
        'vendor.status',
        'vendor.createdDate',
        'contactPersons.email',
        'contactPersons.phoneNumber',
        'tags.id',
        'tags.tagId',
        'tags.enableMail',
      ])
      .getMany()
      .then((results) => results.map((vt) => vt.vendor));
  }

  async updateEnableMail(id: string, enableMail: boolean) {
    await this.update(id, { enableMail });
    return this.findById(id);
  }
}
