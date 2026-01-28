import { Repository } from 'typeorm';
import { Tender } from '../../entities/Tender';

export interface ITenderRepository extends Repository<Tender> {
  createTender(tender: Partial<Tender>): Promise<Tender>;
  findById(id: string): Promise<Tender | null>;
  findByName(name: string): Promise<Tender | null>;
  search(params: { search?: string; limit?: number; offset?: number }): Promise<Tender[]>;
  updateTender(id: string, tender: Partial<Tender>): Promise<Tender | null>;
  deleteTender(id: string): Promise<boolean>;
  deleteTenders(ids: string[]): Promise<boolean>;
}

export interface ITenderService {
  createTender(input: any, context?: { email?: string }): Promise<Tender>;
  updateTender(id: string, input: any): Promise<Tender | null>;
  deleteTender(id: string): Promise<boolean>;
  deleteTenders(ids: string[]): Promise<boolean>;
  getTenderById(id: string): Promise<Tender | null>;
  getTenderByName(name: string): Promise<Tender | null>;
  searchTender(params: any): Promise<Tender[]>;
}
