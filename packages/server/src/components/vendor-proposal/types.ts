import { Repository } from 'typeorm';
import { VendorProposal } from '../../entities/VendorProposal';

export interface IVendorProposalRepository
  extends Repository<VendorProposal> {
  createProposal(
    proposal: Partial<VendorProposal>
  ): Promise<VendorProposal>;

  findById(id: string): Promise<VendorProposal | null>;

  findByVendorId(vendorId: string): Promise<VendorProposal[]>;

  updateProposal(
    id: string,
    proposal: Partial<VendorProposal>
  ): Promise<VendorProposal>;
}

export interface IVendorProposalService {
  createProposal(input: any): Promise<VendorProposal>;
  updateProposalStatus(input: any): Promise<VendorProposal>;
}
