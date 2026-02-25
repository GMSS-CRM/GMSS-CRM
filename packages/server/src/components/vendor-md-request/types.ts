import { Repository } from 'typeorm';
import { VendorMdRequest } from '../../entities/VendorMdRequest';

export interface IVendorMdRequestRepository extends Repository<VendorMdRequest> {
  findById(id: string): Promise<VendorMdRequest | null>;
  findByVendorId(vendorId: string): Promise<VendorMdRequest[]>;
  findPending(): Promise<VendorMdRequest[]>;
  findResolved(): Promise<VendorMdRequest[]>;
  findPendingByVendorId(vendorId: string): Promise<VendorMdRequest | null>;
  createMdRequest(data: Partial<VendorMdRequest>): Promise<VendorMdRequest>;
  markResolved(id: string, data: Partial<VendorMdRequest>): Promise<VendorMdRequest | null>;
}

export interface IVendorMdRequestService {
  createMdRequest(input: any): Promise<any>;
  resolveMdRequest(input: any): Promise<any>;
  getPendingRequests(): Promise<any[]>;
  getResolvedRequests(): Promise<any[]>;
  getMdRequestsByVendor(vendorId: string): Promise<any[]>;
  getActivePendingRequest(vendorId: string): Promise<any>;
}
