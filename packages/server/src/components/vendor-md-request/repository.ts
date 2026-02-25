import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorMdRequest } from '../../entities/VendorMdRequest';
import { IVendorMdRequestRepository } from './types';

@injectable()
export class VendorMdRequestRepository
  extends Repository<VendorMdRequest>
  implements IVendorMdRequestRepository
{
  constructor(@inject(TYPES.DbContext) private readonly dbContext: DataSource) {
    super(VendorMdRequest, dbContext.manager);
  }

  async findById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['vendor'],
    });
  }

  async findByVendorId(vendorId: string) {
    return this.find({
      where: { vendorId },
      relations: ['vendor'],
      order: { createdDate: 'DESC' },
    });
  }

  async findPending() {
    return this.find({
      where: { isResolved: false },
      relations: ['vendor'],
      order: { createdDate: 'DESC' },
    });
  }

  async findResolved() {
    return this.find({
      where: { isResolved: true },
      relations: ['vendor'],
      order: { updatedDate: 'DESC' },
    });
  }

  async findPendingByVendorId(vendorId: string) {
    return this.findOne({
      where: { vendorId, isResolved: false },
      relations: ['vendor'],
    });
  }

  async createMdRequest(data: Partial<VendorMdRequest>) {
    return this.save(this.create(data));
  }

  async markResolved(id: string, data: Partial<VendorMdRequest>) {
    await this.update(id, data);
    return this.findById(id);
  }
}
