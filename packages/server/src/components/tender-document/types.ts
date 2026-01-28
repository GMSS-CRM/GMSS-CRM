import { Repository } from 'typeorm';
import { TenderDocument } from '../../entities/TenderDocument';

export interface ITenderDocumentRepository extends Repository<TenderDocument> {
  createDocument(doc: Partial<TenderDocument>): Promise<TenderDocument>;
  findById(id: string): Promise<TenderDocument | null>;
  findByTenderId(tenderId: string): Promise<TenderDocument[]>;
  search(params: { tenderId?: string; search?: string; limit?: number; offset?: number }): Promise<TenderDocument[]>;
  updateDocument(id: string, doc: Partial<TenderDocument>): Promise<TenderDocument | null>;
  deleteDocument(id: string): Promise<boolean>;
  deleteDocuments(ids: string[]): Promise<boolean>;
}

export interface ITenderDocumentService {
  createDocument(input: any, context?: { email?: string }): Promise<TenderDocument>;
  updateDocument(id: string, input: any): Promise<TenderDocument | null>;
  deleteDocument(id: string): Promise<boolean>;
  deleteDocuments(ids: string[]): Promise<boolean>;
  getDocumentById(id: string): Promise<TenderDocument | null>;
  getDocumentsByTenderId(tenderId: string): Promise<TenderDocument[]>;
  searchDocument(params: any): Promise<TenderDocument[]>;
}
