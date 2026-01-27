import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Vendor, VendorStatus, VendorType } from '../../entities/Vendor';
import { IVendorRepository } from './types';

@injectable()
export class VendorRepository extends Repository<Vendor> implements IVendorRepository {
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(Vendor, dbContext.manager);
  }

  createVendor(vendor: Partial<Vendor>) {
    return this.save(this.create(vendor));
  }

  findById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['tags', 'tags.tag', 'contactPersons', 'documents'],
    });
  }

  findByName(name: string) {
    return this.findOne({
      where: { name },
    });
  }

  search(params: {
    search?: string;
    status?: VendorStatus;
    type?: VendorType;
    limit?: number;
    offset?: number;
  }) {
    const query = this.createQueryBuilder('vendor');

    if (params.search) {
      query.where(
        '(vendor.name ILIKE :search OR vendor.gstNumber ILIKE :search OR vendor.panNumber ILIKE :search)',
        { search: `%${params.search}%` }
      );
    }

    if (params.status) {
      query.andWhere('vendor.status = :status', { status: params.status });
    }

    if (params.type) {
      query.andWhere('vendor.type = :type', { type: params.type });
    }

    query.leftJoinAndSelect('vendor.tags', 'vendorTag');
    query.leftJoinAndSelect('vendorTag.tag', 'tag');
    query.leftJoinAndSelect('vendor.contactPersons', 'contactPersons');
    query.leftJoinAndSelect('vendor.documents', 'documents');

    if (params.limit) {
      query.take(params.limit);
    }

    if (params.offset) {
      query.skip(params.offset);
    }

    return query.getMany();
  }

  updateVendor(id: string, vendor: Partial<Vendor>) {
    return this.update(id, vendor).then(() => this.findById(id));
  }

  deleteVendor(id: string) {
    return this.delete(id).then(() => true);
  }

  deleteVendors(ids: string[]) {
    return this.delete(ids).then(() => true);
  }
}
