import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorTender } from '../../entities/VendorTender';
import { IVendorTenderRepository } from './types';
import ErrorInfo from '../common/error-info';

@injectable()
export class VendorTenderRepository
  extends Repository<VendorTender>
  implements IVendorTenderRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(VendorTender, db.manager);
  }

  createParticipation(data: Partial<VendorTender>) {
    return this.save(this.create(data));
  }

  findByVendor(vendorId: string) {
    return this.find({ where: { vendorId } });
  }

  findByTender(tenderId: string) {
    return this.find({ where: { tenderId } });
  }

  findById(id: string) {
    return this.findOne({ where: { id } });
  }

  async updateParticipation(
    id: string,
    data: Partial<VendorTender>
  ): Promise<VendorTender> {
    await this.update(id, data);

    const updated = await this.findById(id);

    if (!updated) {
      throw new Error(ErrorInfo.TENDER_PARTICIPATION_UPDATE_FAILED);
    }

    return updated;
  }
}
