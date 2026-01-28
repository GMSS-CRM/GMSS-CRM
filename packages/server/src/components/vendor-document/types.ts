import { Repository } from 'typeorm';
import { VendorDocument } from '../../entities/VendorDocument';

export interface IVendorDocumentRepository extends Repository<VendorDocument> {
  createDocument(doc: Partial<VendorDocument>): Promise<VendorDocument>;
  findById(id: string): Promise<VendorDocument | null>;
  findByVendorId(vendorId: string): Promise<VendorDocument[]>;
  search(params: { vendorId?: string; search?: string; limit?: number; offset?: number }): Promise<VendorDocument[]>;
  updateDocument(id: string, doc: Partial<VendorDocument>): Promise<VendorDocument | null>;
  deleteDocument(id: string): Promise<boolean>;
  deleteDocuments(ids: string[]): Promise<boolean>;
}

export interface IVendorDocumentService {
  createDocument(input: any, context?: { email?: string }): Promise<VendorDocument>;
  updateDocument(id: string, input: any): Promise<VendorDocument | null>;
  deleteDocument(id: string): Promise<boolean>;
  deleteDocuments(ids: string[]): Promise<boolean>;
  getDocumentById(id: string): Promise<VendorDocument | null>;
  getDocumentsByVendorId(vendorId: string): Promise<VendorDocument[]>;
  searchDocument(params: any): Promise<VendorDocument[]>;
}
