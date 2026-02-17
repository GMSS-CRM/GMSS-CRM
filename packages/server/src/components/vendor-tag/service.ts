import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { IVendorTagService, IVendorTagRepository } from './types';
import ErrorInfo from '../common/error-info';
import { getCurrentEmail } from '../common/utils';

@injectable()
export class VendorTagService implements IVendorTagService {
  constructor(
    @inject(TYPES.IVendorTagRepository)
    private readonly vendorTagRepository: IVendorTagRepository
  ) {}

  async createVendorTag(input: any) {
    if (!input.vendorId || !input.vendorId.trim()) {
      throw new Error(ErrorInfo.VENDOR_ID_REQUIRED);
    }

    if (!input.tagId || !input.tagId.trim()) {
      throw new Error(ErrorInfo.TAG_ID_REQUIRED);
    }

    const createdBy = getCurrentEmail();

    return this.vendorTagRepository.createVendorTag({
      vendorId: input.vendorId,
      tagId: input.tagId,
      enableMail: input.enableMail ?? true,
      createdBy: createdBy,
    });
  }

  async deleteVendorTag(id: string) {
    return this.vendorTagRepository.deleteVendorTag(id);
  }

  async getVendorsByTag(tagId: string) {
    return this.vendorTagRepository.findVendorsByTagId(tagId);
  }
}
