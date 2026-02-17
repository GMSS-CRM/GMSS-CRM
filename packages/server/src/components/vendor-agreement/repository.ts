import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorAgreement } from '../../entities/VendorAgreement';
import { IVendorAgreementRepository } from './types';
import ErrorInfo from '../common/error-info';

@injectable()
export class VendorAgreementRepository
  extends Repository<VendorAgreement>
  implements IVendorAgreementRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(VendorAgreement, db.manager);
  }

  createAgreement(agreement: Partial<VendorAgreement>) {
    return this.save(this.create(agreement));
  }

  async findById(id: string): Promise<VendorAgreement> {
  const agreement = await this.findOne({ where: { id } });

  if (!agreement) {
    throw new Error(ErrorInfo.AGREEMENT_NOT_FOUND);
  }

  return agreement;
}


  findByVendorId(vendorId: string) {
    return this.find({ where: { vendorId } });
  }

  async updateAgreement(
  id: string,
  agreement: Partial<VendorAgreement>
): Promise<VendorAgreement> {
  await this.update(id, agreement);

  const updated = await this.findById(id);

  if (!updated) {
    throw new Error(ErrorInfo.AGREEMENT_UPDATE_FAILED);
  }

  return updated;
}

}
