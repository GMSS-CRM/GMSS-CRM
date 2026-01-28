import { Repository } from 'typeorm';
import { Vendor, CompanyType } from '../../entities/Vendor';
import { VendorTag } from '../../entities/VendorTag';

export interface IVendorRepository extends Repository<Vendor> {
  createVendor(vendor: Partial<Vendor>): Promise<Vendor>;
  findById(id: string): Promise<Vendor | null>;
  findByName(name: string): Promise<Vendor | null>;
  search(params: { search?: string; status?: CompanyType; type?: string; limit?: number; offset?: number }): Promise<Vendor[]>;
  updateVendor(id: string, vendor: Partial<Vendor>): Promise<Vendor | null>;
  deleteVendor(id: string): Promise<boolean>;
  deleteVendors(ids: string[]): Promise<boolean>;
  createVendorTag(vendorTag: Partial<VendorTag>): Promise<VendorTag>;
  deleteVendorTag(id: string): Promise<boolean>;
}

export interface IVendorService {
  createVendor(input: any, context?: { email?: string }): Promise<Vendor>;
  updateVendor(id: string, input: any): Promise<Vendor | null>;
  deleteVendor(id: string): Promise<boolean>;
  deleteVendors(ids: string[]): Promise<boolean>;
  getVendorById(id: string): Promise<Vendor | null>;
  getVendorByName(name: string): Promise<Vendor | null>;
  searchVendor(params: any): Promise<Vendor[]>;
  createVendorTag(input: any, context?: { email?: string }): Promise<VendorTag>;
  deleteVendorTag(id: string): Promise<boolean>;
}
