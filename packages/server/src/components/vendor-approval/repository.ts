import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorApproval } from '../../entities/VendorApproval';
import { IVendorApprovalRepository } from './types';

@injectable()
export class VendorApprovalRepository
  extends Repository<VendorApproval>
  implements IVendorApprovalRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(VendorApproval, db.manager);
  }

  createApproval(approval: Partial<VendorApproval>) {
    return this.save(this.create(approval));
  }

  findById(id: string) {
    return this.findOne({ where: { id } });
  }

  findByVendorId(vendorId: string) {
    return this.find({
      where: { vendorId },
      order: { createdDate: 'DESC' },
    });
  }
}
