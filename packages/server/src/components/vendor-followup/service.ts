import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IVendorFollowUpRepository,
  IVendorFollowUpService,
} from './types';
import ErrorInfo from '../common/error-info';
import { IVendorRepository } from '../vendor/types';
import { getCurrentEmail } from '../common/utils';

@injectable()
export class VendorFollowUpService
  implements IVendorFollowUpService
{
  constructor(
    @inject(TYPES.IVendorFollowUpRepository)
    private readonly repository: IVendorFollowUpRepository,

    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository
  ) {}

  async createFollowUp(input: any) {
    const vendor = await this.vendorRepository.findById(
      input.vendorId
    );

    if (!vendor || vendor.isDeleted) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    return this.repository.createFollowUp({
      vendorId: input.vendorId,
      type: input.type,
      nextFollowUpDate: new Date(input.nextFollowUpDate),
      remarks: input.remarks,
      isCompleted: false,
      reminderSent: false,
      createdBy: getCurrentEmail(),
    });
  }

  async completeFollowUp(input: any) {
    const followUp = await this.repository.findById(
      input.followUpId
    );

    if (!followUp) {
      throw new Error(ErrorInfo.FOLLOWUP_NOT_FOUND);
    }

    if (followUp.isCompleted) {
      throw new Error(ErrorInfo.FOLLOWUP_ALREADY_COMPLETED);
    }

    return this.repository.updateFollowUp(
      input.followUpId,
      {
        isCompleted: true,
      }
    );
  }
}
