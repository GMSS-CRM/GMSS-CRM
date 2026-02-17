import { Repository } from 'typeorm';
import { VendorApproval } from '../../entities/VendorApproval';
import { Vendor } from '../../entities/Vendor';

export interface IVendorApprovalRepository
  extends Repository<VendorApproval> {
  createApproval(
    approval: Partial<VendorApproval>
  ): Promise<VendorApproval>;

  findById(id: string): Promise<VendorApproval | null>;

  findByVendorId(vendorId: string): Promise<VendorApproval[]>;
}

export interface IVendorApprovalService {
  requestApproval(vendorId: string): Promise<VendorApproval>;

  decideApproval(
    approvalId: string,
    status: string,
    remarks?: string
  ): Promise<Vendor>;
}
