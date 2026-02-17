import { Repository } from 'typeorm';
import { Vendor } from '../../entities/Vendor';
import { VendorStatus } from '../../entities/enums/VendorStatus';

export interface IVendorRepository extends Repository<Vendor> {
  createVendor(vendor: Partial<Vendor>): Promise<Vendor>;
  findById(id: string): Promise<Vendor | null>;
  findByName(name: string): Promise<Vendor | null>;
  search(params: {
    search?: string;
    status?: VendorStatus;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<Vendor[]>;
  updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor>;
  softDeleteVendor(id: string, deletedBy: string): Promise<boolean>;
}

export interface IVendorService {
  createVendor(input: any): Promise<Vendor>;
  updateVendor(id: string, input: any): Promise<Vendor>;
  deleteVendor(id: string): Promise<boolean>;
  deleteVendors(ids: string[]): Promise<boolean[]>;
  changeStatus(
    vendorId: string,
    newStatus: VendorStatus,
    remarks?: string
  ): Promise<Vendor>;
  getVendorById(id: string): Promise<Vendor | null>;
  searchVendor(params: any): Promise<Vendor[]>;
}
