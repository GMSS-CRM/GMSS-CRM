import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { TYPES } from '../../inversify/types';
import { VendorProposal } from '../../entities/VendorProposal';
import { IVendorProposalRepository } from './types';
import ErrorInfo from '../common/error-info';

@injectable()
export class VendorProposalRepository
  extends Repository<VendorProposal>
  implements IVendorProposalRepository
{
  constructor(@inject(TYPES.DbContext) private readonly db: DataSource) {
    super(VendorProposal, db.manager);
  }

  createProposal(proposal: Partial<VendorProposal>) {
    return this.save(this.create(proposal));
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

  async updateProposal(
  id: string,
  proposal: Partial<VendorProposal>
): Promise<VendorProposal> {
  await this.update(id, proposal);

  const updated = await this.findById(id);

  if (!updated) {
    throw new Error(ErrorInfo.PROPOSAL_UPDATE_FAILED);
  }

  return updated;
}

}
