import { Repository } from 'typeorm';
import { VendorWorkflow } from '../../entities/VendorWorkflow';
import { VendorStatus } from '../../entities/enums/VendorStatus';
import { Vendor } from '../../entities/Vendor';

export interface IVendorWorkflowRepository
  extends Repository<VendorWorkflow> {
  findByVendorId(vendorId: string): Promise<VendorWorkflow[]>;
}

export interface IVendorWorkflowService {
  changeStatus(
    vendorId: string,
    newStatus: VendorStatus,
    remarks?: string
  ): Promise<Vendor>;

  getWorkflow(vendorId: string): Promise<VendorWorkflow[]>;
}
