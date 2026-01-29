import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { ITenderService, ITenderRepository } from './types';
import ErrorInfo from '../common/error-info';
import { getCurrentEmail } from '../common/utils';

@injectable()
export class TenderService implements ITenderService {
  constructor(@inject(TYPES.ITenderRepository) private readonly tenderRepository: ITenderRepository) {}

  async createTender(input: any) {
    if (!input.name || input.name.trim() === '') {
      throw new Error(ErrorInfo.TENDER_NAME_REQUIRED);
    }

    const existingTender = await this.tenderRepository.findByName(input.name);
    if (existingTender) {
      throw new Error(ErrorInfo.TENDER_ALREADY_EXISTS);
    }

    const createdBy = getCurrentEmail();

    return this.tenderRepository.createTender({
      name: input.name.trim(),
      createdBy: createdBy,
      updatedBy: createdBy,
    });
  }

  async updateTender(id: string, input: any) {
    const existingTender = await this.tenderRepository.findById(id);
    if (!existingTender) {
      throw new Error(ErrorInfo.TENDER_NOT_FOUND);
    }

    const updateData: any = { updatedBy: getCurrentEmail() };

    if (input.name !== null && input.name !== undefined) {
      const duplicate = await this.tenderRepository.findByName(input.name);
      if (duplicate && duplicate.id !== id) {
        throw new Error(ErrorInfo.TENDER_ALREADY_EXISTS);
      }
      updateData.name = input.name.trim();
    }

    return this.tenderRepository.updateTender(id, updateData);
  }

  async deleteTender(id: string) {
    const tender = await this.tenderRepository.findById(id);
    if (!tender) {
      throw new Error(ErrorInfo.TENDER_NOT_FOUND);
    }
    return this.tenderRepository.deleteTender(id);
  }

  async deleteTenders(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error(ErrorInfo.NO_TENDERS_TO_DELETE);
    }
    return this.tenderRepository.deleteTenders(ids);
  }

  async getTenderById(id: string) {
    return this.tenderRepository.findById(id);
  }

  async getTenderByName(name: string) {
    return this.tenderRepository.findByName(name);
  }

  async searchTender(params: any) {
    return this.tenderRepository.search(params);
  }
}
