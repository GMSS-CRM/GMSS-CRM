import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IVendorApprovalService,
  IVendorApprovalRepository,
} from './types';
import ErrorInfo from '../common/error-info';
import { VendorStatus } from '../../entities/enums/VendorStatus';
import { ApprovalStatus } from '../../entities/VendorApproval';
import { getCurrentEmail } from '../common/utils';
import { IVendorWorkflowService } from '../vendor-workflow/types';
import { IVendorRepository } from '../vendor/types';

@injectable()
export class VendorApprovalService
  implements IVendorApprovalService
{
  constructor(
    @inject(TYPES.IVendorApprovalRepository)
    private readonly repository: IVendorApprovalRepository,

    @inject(TYPES.IVendorWorkflowService)
    private readonly workflowService: IVendorWorkflowService,

    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository,

    @inject(TYPES.DbContext)
    private readonly db: any
  ) {}

  async requestApproval(vendorId: string) {
    const vendor = await this.vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    if (vendor.status !== VendorStatus.INTERESTED) {
      throw new Error(
        ErrorInfo.APPROVAL_ALREADY_EXISTS
      );
    }

    return this.repository.createApproval({
      vendorId,
      status: ApprovalStatus.PENDING,
    });
  }

  async decideApproval(
    approvalId: string,
    status: ApprovalStatus,
    remarks?: string
  ) {
    const approval = await this.repository.findById(approvalId);

    if (!approval) {
      throw new Error(ErrorInfo.APPROVAL_NOT_FOUND);
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      throw new Error(ErrorInfo.APPROVAL_ALREADY_DECIDED);
    }

    return await this.db.transaction(async (manager: any) => {
      approval.status = status;
      approval.remarks = remarks;
      approval.approvedBy = getCurrentEmail();
      approval.approvedDate = new Date();

      await manager.save(approval);

      if (status === ApprovalStatus.APPROVED) {
        return this.workflowService.changeStatus(
          approval.vendorId,
          VendorStatus.APPROVED,
          'Approved by MD'
        );
      }

      if (status === ApprovalStatus.REJECTED) {
        return this.workflowService.changeStatus(
          approval.vendorId,
          VendorStatus.NOT_INTERESTED,
          'Rejected by MD'
        );
      }

      return null;
    });
  }
}
