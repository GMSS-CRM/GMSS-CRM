import { Repository } from 'typeorm';
import { VendorContactPerson } from '../../entities/VendorContactPerson';

export interface IVendorContactPersonRepository extends Repository<VendorContactPerson> {
  createContactPerson(contact: Partial<VendorContactPerson>): Promise<VendorContactPerson>;
  findById(id: string): Promise<VendorContactPerson | null>;
  findByVendorId(vendorId: string): Promise<VendorContactPerson[]>;
  search(params: { vendorId?: string; search?: string; limit?: number; offset?: number }): Promise<VendorContactPerson[]>;
  updateContactPerson(id: string, contact: Partial<VendorContactPerson>): Promise<VendorContactPerson | null>;
  deleteContactPerson(id: string): Promise<boolean>;
  deleteContactPersons(ids: string[]): Promise<boolean>;
}

export interface IVendorContactPersonService {
  createContactPerson(input: any, actor?: { email?: string }): Promise<VendorContactPerson>;
  updateContactPerson(id: string, input: any): Promise<VendorContactPerson | null>;
  deleteContactPerson(id: string): Promise<boolean>;
  deleteContactPersons(ids: string[]): Promise<boolean>;
  getContactPersonById(id: string): Promise<VendorContactPerson | null>;
  getContactPersonsByVendorId(vendorId: string): Promise<VendorContactPerson[]>;
  searchContactPerson(params: any): Promise<VendorContactPerson[]>;
}
