import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IVendorFollowUpRepository,
  IVendorFollowUpService,
} from './types';
import ErrorInfo from '../common/error-info';
import { IVendorRepository } from '../vendor/types';
import { getCurrentEmail } from '../common/utils';
import { FollowUpStatus } from '../../entities/VendorFollowUp';

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
      followUpStatus: FollowUpStatus.PENDING,
      nextFollowUpDate: input.nextFollowUpDate ? new Date(input.nextFollowUpDate) : undefined,
      remarks: input.remarks,
      courierTrackingNumber: input.courierTrackingNumber || undefined,
      courierProvider: input.courierProvider || undefined,
      courierDeliveryRemarks: input.courierDeliveryRemarks || undefined,
      isCompleted: false,
      autoMailSent: false,
      createdBy: getCurrentEmail(),
    });
  }

  async updateFollowUp(input: any) {
    const followUp = await this.repository.findById(input.followUpId);

    if (!followUp) {
      throw new Error(ErrorInfo.FOLLOWUP_NOT_FOUND);
    }

    const updateData: any = {};

    if (input.followUpStatus !== undefined) updateData.followUpStatus = input.followUpStatus;
    if (input.remarks !== undefined)         updateData.remarks = input.remarks;
    if (input.nextFollowUpDate !== undefined) updateData.nextFollowUpDate = input.nextFollowUpDate ? new Date(input.nextFollowUpDate) : null;
    if (input.documentUrl !== undefined)     updateData.documentUrl = input.documentUrl;
    if (input.documentName !== undefined)    updateData.documentName = input.documentName;
    if (input.courierTrackingNumber !== undefined)  updateData.courierTrackingNumber = input.courierTrackingNumber;
    if (input.courierProvider !== undefined)        updateData.courierProvider = input.courierProvider;
    if (input.courierDeliveryRemarks !== undefined) updateData.courierDeliveryRemarks = input.courierDeliveryRemarks;
    if (input.isCompleted !== undefined)     updateData.isCompleted = input.isCompleted;

    return this.repository.updateFollowUp(input.followUpId, updateData);
  }

  async deleteFollowUp(id: string) {
    const followUp = await this.repository.findById(id);

    if (!followUp) {
      throw new Error(ErrorInfo.FOLLOWUP_NOT_FOUND);
    }

    return this.repository.deleteFollowUp(id);
  }
}
