import { Repository } from 'typeorm';
import { VendorTender } from '../../entities/VendorTender';

export interface IVendorTenderRepository
  extends Repository<VendorTender> {
  createParticipation(data: Partial<VendorTender>): Promise<VendorTender>;
  findByVendor(vendorId: string): Promise<VendorTender[]>;
  findByVendorWithTender(vendorId: string): Promise<VendorTender[]>;
  findByTender(tenderId: string): Promise<VendorTender[]>;
  findByTenderWithVendors(tenderId: string): Promise<VendorTender[]>;
  findById(id: string): Promise<VendorTender | null>;
  updateFollowUp(id: string, data: Partial<VendorTender>): Promise<VendorTender>;
}

export interface IVendorTenderService {
  participateInTender(input: any): Promise<VendorTender>;
  updateParticipationStatus(input: any): Promise<VendorTender>;
  getTenderFollowUps(tenderId: string): Promise<VendorTender[]>;
  updateFollowUp(id: string, data: Partial<VendorTender>): Promise<VendorTender>;
}
