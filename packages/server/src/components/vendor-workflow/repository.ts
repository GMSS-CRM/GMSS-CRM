import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorWorkflow } from '../../entities/VendorWorkflow';
import { IVendorWorkflowRepository } from './types';

@injectable()
export class VendorWorkflowRepository
  extends Repository<VendorWorkflow>
  implements IVendorWorkflowRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(VendorWorkflow, db.manager);
  }

  findByVendorId(vendorId: string) {
    return this.find({
      where: { vendorId },
      order: { changedAt: 'DESC' },
    });
  }
}
