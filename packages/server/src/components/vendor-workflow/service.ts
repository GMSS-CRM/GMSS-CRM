import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { IVendorWorkflowService } from './types';
import { IVendorRepository } from '../vendor/types';
import { IVendorWorkflowRepository } from './types';
import ErrorInfo from '../common/error-info';
import { VendorStatus } from '../../entities/enums/VendorStatus';
import { VALID_VENDOR_TRANSITIONS } from './constants';
import { getCurrentEmail } from '../common/utils';
import { VendorWorkflow } from '../../entities/VendorWorkflow';

@injectable()
export class VendorWorkflowService
  implements IVendorWorkflowService
{
  constructor(
    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository,

    @inject(TYPES.IVendorWorkflowRepository)
    private readonly workflowRepository: IVendorWorkflowRepository,

    @inject(TYPES.DbContext)
    private readonly db: any
  ) {}

  async changeStatus(
    vendorId: string,
    newStatus: VendorStatus,
    remarks?: string
  ) {
    const vendor = await this.vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    const currentStatus = vendor.status;

    if (currentStatus === newStatus) {
      throw new Error(ErrorInfo.VENDOR_STATUS_SAME);
    }

    const allowedTransitions =
      VALID_VENDOR_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(newStatus)) {
      throw new Error(
        `Invalid transition from ${currentStatus} to ${newStatus}`
      );
    }

    return await this.db.transaction(async (manager: any) => {
      vendor.status = newStatus;
      vendor.updatedBy = getCurrentEmail();

      await manager.save(vendor);

      const workflow = manager.create(VendorWorkflow, {
        vendorId,
        fromStatus: currentStatus,
        toStatus: newStatus,
        remarks,
        changedBy: getCurrentEmail(),
      });

      await manager.save(workflow);

      return vendor;
    });
  }

  async getWorkflow(vendorId: string) {
    return this.workflowRepository.findByVendorId(vendorId);
  }
}
