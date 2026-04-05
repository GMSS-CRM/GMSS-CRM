import { Repository } from 'typeorm';
import { Tender } from '../../entities/Tender';

export interface ITenderRepository extends Repository<Tender> {
  createTender(tender: Partial<Tender>): Promise<Tender>;
  findById(id: string): Promise<Tender | null>;
  findByName(name: string): Promise<Tender | null>;
  findExisting(referenceNumbers: string[], names: string[]): Promise<Tender[]>;
  search(params: { search?: string; status?: string; limit?: number; offset?: number }): Promise<Tender[]>;
  updateTender(id: string, tender: Partial<Tender>): Promise<Tender | null>;
  deleteTender(id: string): Promise<boolean>;
  deleteTenders(ids: string[]): Promise<boolean>;
}

export interface SkippedTenderInfo {
  name: string;
  referenceNumber?: string;
  reason: string;
}

export interface CreateTendersBatchResult {
  created: Tender[];
  skipped: SkippedTenderInfo[];
}

export interface ITenderService {
  createTender(input: any, context?: { email?: string }): Promise<Tender>;
  createTendersBatch(inputs: any[]): Promise<CreateTendersBatchResult>;
  updateTender(id: string, input: any): Promise<Tender | null>;
  changeTenderStatus(input: any): Promise<Tender | null>;
  deleteTender(id: string): Promise<boolean>;
  deleteTenders(ids: string[]): Promise<boolean>;
  getTenderById(id: string): Promise<Tender | null>;
  getTenderByName(name: string): Promise<Tender | null>;
  searchTender(params: any): Promise<Tender[]>;
  seedTenderVendors(tenderId: string): Promise<boolean>;
  silenceTenderCountdown(tenderId: string, reason: string, newDeadline?: string, remarks?: string): Promise<Tender>;
  checkDeadlineReminders(): Promise<number>;
}
