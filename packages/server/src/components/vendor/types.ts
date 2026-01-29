import { Repository } from 'typeorm';
import { Vendor, CompanyType } from '../../entities/Vendor';

export interface IVendorRepository extends Repository<Vendor> {
  createVendor(vendor: Partial<Vendor>): Promise<Vendor>;
  findById(id: string): Promise<Vendor | null>;
  findByName(name: string): Promise<Vendor | null>;
  search(params: { search?: string; status?: CompanyType; type?: string; limit?: number; offset?: number }): Promise<Vendor[]>;
  updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor | null>;
  deleteVendor(id: string): Promise<boolean>;
  deleteVendors(ids: string[]): Promise<boolean>;
}

export interface IVendorService {
  createVendor(input: any): Promise<Vendor>;
  updateVendor(id: string, input: any): Promise<Vendor | null>;
  deleteVendor(id: string): Promise<boolean>;
  deleteVendors(ids: string[]): Promise<boolean>;
  getVendorById(id: string): Promise<Vendor | null>;
  getVendorByName(name: string): Promise<Vendor | null>;
  searchVendor(params: any): Promise<Vendor[]>;
}
