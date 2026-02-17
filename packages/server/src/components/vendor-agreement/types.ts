import { Repository } from 'typeorm';
import { VendorAgreement } from '../../entities/VendorAgreement';

export interface IVendorAgreementRepository
  extends Repository<VendorAgreement> {
  createAgreement(
    agreement: Partial<VendorAgreement>
  ): Promise<VendorAgreement>;

  findById(id: string): Promise<VendorAgreement | null>;

  findByVendorId(vendorId: string): Promise<VendorAgreement[]>;

  updateAgreement(
    id: string,
    agreement: Partial<VendorAgreement>
  ): Promise<VendorAgreement >;
}

export interface IVendorAgreementService {
  createAgreement(input: any): Promise<VendorAgreement>;

  updateSignature(input: any): Promise<VendorAgreement | null>;
}
