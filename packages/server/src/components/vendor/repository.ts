import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { Vendor } from '../../entities/Vendor';
import { IVendorRepository } from './types';
import { VendorStatus } from '../../entities/enums/VendorStatus';

@injectable()
export class VendorRepository
  extends Repository<Vendor>
  implements IVendorRepository
{
  constructor(
    @inject(TYPES.DbContext)
    private readonly dbContext: DataSource
  ) {
    super(Vendor, dbContext.manager);
  }

  createVendor(vendor: Partial<Vendor>) {
    return this.save(this.create(vendor));
  }

  findById(id: string) {
    return this.findOne({
      where: { id, isDeleted: false },
      relations: [
        'workflows',
        'approvals',
        'proposals',
        'agreements',
        'followUps',
        'tenders',
      ],
    });
  }

  findByName(name: string) {
    return this.findOne({
      where: { name, isDeleted: false },
    });
  }

  search(
  params: {
    search?: string;
    status?: VendorStatus;
    type?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const query = this.createQueryBuilder('vendor')
    .where('vendor.isDeleted = false');

  if (params.search) {
    query.andWhere(
      `(LOWER(vendor.name) LIKE LOWER(:search)
        OR LOWER(vendor.gstNumber) LIKE LOWER(:search)
        OR LOWER(vendor.panNumber) LIKE LOWER(:search))`,
      { search: `%${params.search}%` }
    );
  }

  if (params.status) {
    query.andWhere('vendor.status = :status', {
      status: params.status,
    });
  }

  if (params.type) {
    query.andWhere('vendor.type = :type', {
      type: params.type,
    });
  }

  if (params.limit) {
    query.take(params.limit);
  }

  if (params.offset) {
    query.skip(params.offset);
  }

  return query.getMany();
}


  async updateVendor(
    id: string,
    vendor: Partial<Vendor>
  ): Promise<Vendor> {
    await this.update(id, vendor);

    const updated = await this.findById(id);

    if (!updated) {
      throw new Error('Failed to update vendor');
    }

    return updated;
  }

  async softDeleteVendor(
    id: string,
    deletedBy: string
  ): Promise<boolean> {
    const vendor = await this.findById(id);

    if (!vendor) return false;

    vendor.isDeleted = true;
    vendor.deletedBy = deletedBy;
    vendor.deletedDate = new Date();
    vendor.status = VendorStatus.DELETED;

    await this.save(vendor);
    return true;
  }
}
