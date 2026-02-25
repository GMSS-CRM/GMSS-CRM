import { Repository } from 'typeorm';
import { VendorFollowUp } from '../../entities/VendorFollowUp';

export interface IVendorFollowUpRepository
  extends Repository<VendorFollowUp> {
  createFollowUp(
    followUp: Partial<VendorFollowUp>
  ): Promise<VendorFollowUp>;

  findByVendorId(vendorId: string): Promise<VendorFollowUp[]>;

  findById(id: string): Promise<VendorFollowUp | null>;

  updateFollowUp(
    id: string,
    data: Partial<VendorFollowUp>
  ): Promise<VendorFollowUp>;
}

export interface IVendorFollowUpService {
  createFollowUp(input: any): Promise<VendorFollowUp>;
  completeFollowUp(input: any): Promise<VendorFollowUp>;
}
