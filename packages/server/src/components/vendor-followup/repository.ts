import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorFollowUp } from '../../entities/VendorFollowUp';
import { IVendorFollowUpRepository } from './types';
import ErrorInfo from '../common/error-info';

@injectable()
export class VendorFollowUpRepository
  extends Repository<VendorFollowUp>
  implements IVendorFollowUpRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(VendorFollowUp, db.manager);
  }

  createFollowUp(followUp: Partial<VendorFollowUp>) {
    return this.save(this.create(followUp));
  }

  findByVendorId(vendorId: string) {
    return this.find({
      where: { vendorId },
      order: { createdDate: 'DESC' },
    });
  }

  findById(id: string) {
    return this.findOne({ where: { id } });
  }

  async updateFollowUp(
    id: string,
    data: Partial<VendorFollowUp>
  ): Promise<VendorFollowUp> {
    await this.update(id, data);

    const updated = await this.findById(id);

    if (!updated) {
      throw new Error(ErrorInfo.FOLLOWUP_UPDATE_FAILED);
    }

    return updated;
  }

  async deleteFollowUp(id: string): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
