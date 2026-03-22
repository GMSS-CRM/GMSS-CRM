import { TenderContact } from '../../entities/TenderContact';

export interface ITenderContactRepository {
  findByTenderId(tenderId: string): Promise<TenderContact[]>;
  createContact(data: Partial<TenderContact>): Promise<TenderContact>;
  updateContact(id: string, data: Partial<TenderContact>): Promise<TenderContact>;
  deleteContact(id: string): Promise<void>;
}

export interface ITenderContactService {
  getByTenderId(tenderId: string): Promise<TenderContact[]>;
  create(data: Partial<TenderContact>): Promise<TenderContact>;
  update(id: string, data: Partial<TenderContact>): Promise<TenderContact>;
  delete(id: string): Promise<void>;
}
