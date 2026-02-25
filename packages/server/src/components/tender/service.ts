import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { ITenderService, ITenderRepository } from './types';
import { TenderStatus } from '../../entities/enums/TenderStatus';
import { VALID_TENDER_TRANSITIONS } from './constants';
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
      referenceNumber: input.referenceNumber ?? undefined,
      issuingDepartment: input.issuingDepartment ?? undefined,
      description: input.description ?? undefined,
      submissionDeadline: input.submissionDeadline
        ? new Date(input.submissionDeadline)
        : undefined,
      status: TenderStatus.DRAFT,
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

    if (input.referenceNumber !== undefined) {
      updateData.referenceNumber = input.referenceNumber;
    }
    if (input.issuingDepartment !== undefined) {
      updateData.issuingDepartment = input.issuingDepartment;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    if (input.submissionDeadline !== undefined) {
      updateData.submissionDeadline = input.submissionDeadline
        ? new Date(input.submissionDeadline)
        : null;
    }

    return this.tenderRepository.updateTender(id, updateData);
  }

  async changeTenderStatus(input: any) {
    const tender = await this.tenderRepository.findById(input.tenderId);
    if (!tender) {
      throw new Error(ErrorInfo.TENDER_NOT_FOUND);
    }

    const currentStatus = tender.status as TenderStatus;
    const nextStatus = input.status as TenderStatus;

    if (currentStatus === nextStatus) {
      throw new Error('Tender is already in this status');
    }

    const allowedTransitions = VALID_TENDER_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(nextStatus)) {
      throw new Error(
        `Invalid transition from ${currentStatus} to ${nextStatus}. Allowed: ${allowedTransitions.join(', ') || 'none'}`,
      );
    }

    const updateData: any = {
      status: nextStatus,
      updatedBy: getCurrentEmail(),
    };

    // Handle rejection reason
    if (nextStatus === TenderStatus.REJECTED && input.rejectionReason) {
      updateData.rejectionReason = input.rejectionReason;
    }

    // Clear rejection reason when moving out of REJECTED
    if (currentStatus === TenderStatus.REJECTED) {
      updateData.rejectionReason = null;
    }

    // Set mailSentAt timestamp
    if (nextStatus === TenderStatus.MAIL_SENT) {
      updateData.mailSentAt = new Date();
    }

    return this.tenderRepository.updateTender(input.tenderId, updateData);
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
    return this.tenderRepository.search(params || {});
  }
}
