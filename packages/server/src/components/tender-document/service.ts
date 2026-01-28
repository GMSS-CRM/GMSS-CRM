import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { ITenderDocumentService, ITenderDocumentRepository } from './types';
import ErrorInfo from '../common/error-info';

@injectable()
export class TenderDocumentService implements ITenderDocumentService {
  constructor(
    @inject(TYPES.ITenderDocumentRepository)
    private readonly documentRepository: ITenderDocumentRepository
  ) {}

  async createDocument(input: any, context?: { email?: string }) {
    if (!input.tenderId || !input.tenderId.trim()) {
      throw new Error(ErrorInfo.TENDER_ID_REQUIRED);
    }

    if (!input.documentName || input.documentName.trim() === '') {
      throw new Error(ErrorInfo.DOCUMENT_NAME_REQUIRED);
    }

    if (!input.documentUrl || input.documentUrl.trim() === '') {
      throw new Error(ErrorInfo.DOCUMENT_URL_REQUIRED);
    }

    return this.documentRepository.createDocument({
      tenderId: input.tenderId,
      documentName: input.documentName.trim(),
      documentUrl: input.documentUrl.trim(),
      expiresOn: input.expiresOn ? new Date(input.expiresOn) : undefined,
      createdBy: context?.email ?? 'SYSTEM',
    });
  }

  async updateDocument(id: string, input: any) {
    const existingDoc = await this.documentRepository.findById(id);
    if (!existingDoc) {
      throw new Error(ErrorInfo.TENDER_DOCUMENT_NOT_FOUND);
    }

    const updateData: any = {};

    if (input.documentName !== null && input.documentName !== undefined) {
      updateData.documentName = input.documentName.trim();
    }

    if (input.documentUrl !== null && input.documentUrl !== undefined) {
      updateData.documentUrl = input.documentUrl.trim();
    }

    if (input.expiresOn !== null && input.expiresOn !== undefined) {
      updateData.expiresOn = input.expiresOn ? new Date(input.expiresOn) : undefined;
    }

    return this.documentRepository.updateDocument(id, updateData);
  }

  async deleteDocument(id: string) {
    const doc = await this.documentRepository.findById(id);
    if (!doc) {
      throw new Error(ErrorInfo.TENDER_DOCUMENT_NOT_FOUND);
    }
    return this.documentRepository.deleteDocument(id);
  }

  async deleteDocuments(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error(ErrorInfo.NO_TENDER_DOCUMENTS_TO_DELETE);
    }
    return this.documentRepository.deleteDocuments(ids);
  }

  async getDocumentById(id: string) {
    return this.documentRepository.findById(id);
  }

  async getDocumentsByTenderId(tenderId: string) {
    return this.documentRepository.findByTenderId(tenderId);
  }

  async searchDocument(params: any) {
    return this.documentRepository.search(params);
  }
}
