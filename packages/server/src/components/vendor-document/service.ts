import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { IVendorDocumentService, IVendorDocumentRepository } from './types';
import ErrorInfo from '../common/error-info';
import { getCurrentEmail } from '../common/utils';

@injectable()
export class VendorDocumentService implements IVendorDocumentService {
  constructor(
    @inject(TYPES.IVendorDocumentRepository)
    private readonly documentRepository: IVendorDocumentRepository
  ) {}

  async createDocument(input: any) {
    if (!input.vendorId || !input.vendorId.trim()) {
      throw new Error(ErrorInfo.VENDOR_ID_REQUIRED);
    }

    if (!input.documentName || input.documentName.trim() === '') {
      throw new Error(ErrorInfo.DOCUMENT_NAME_REQUIRED);
    }

    if (!input.documentUrl || input.documentUrl.trim() === '') {
      throw new Error(ErrorInfo.DOCUMENT_URL_REQUIRED);
    }

    const createdBy = getCurrentEmail();

    return this.documentRepository.createDocument({
      vendorId: input.vendorId,
      documentName: input.documentName.trim(),
      documentUrl: input.documentUrl.trim(),
      expiresOn: input.expiresOn ? new Date(input.expiresOn) : undefined,
      createdBy: createdBy,
      updatedBy: createdBy,
    });
  }

  async updateDocument(id: string, input: any) {
    const existingDoc = await this.documentRepository.findById(id);
    if (!existingDoc) {
      throw new Error(ErrorInfo.DOCUMENT_NOT_FOUND);
    }

    const updateData: any = { updatedBy: getCurrentEmail() };

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
      throw new Error(ErrorInfo.DOCUMENT_NOT_FOUND);
    }
    return this.documentRepository.deleteDocument(id);
  }

  async deleteDocuments(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error(ErrorInfo.NO_DOCUMENTS_TO_DELETE);
    }
    return this.documentRepository.deleteDocuments(ids);
  }

  async getDocumentById(id: string) {
    return this.documentRepository.findById(id);
  }

  async getDocumentsByVendorId(vendorId: string) {
    return this.documentRepository.findByVendorId(vendorId);
  }

  async searchDocument(params: any) {
    return this.documentRepository.search(params || {});
  }
}
