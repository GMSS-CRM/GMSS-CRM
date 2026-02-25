import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import { IVendorMdRequestService, IVendorMdRequestRepository } from './types';
import { IVendorRepository } from '../vendor/types';
import { IVendorWorkflowService } from '../vendor-workflow/types';
import { VendorStatus } from '../../entities/enums/VendorStatus';
import ErrorInfo from '../common/error-info';
import { getCurrentEmail } from '../common/utils';

@injectable()
export class VendorMdRequestService implements IVendorMdRequestService {
  constructor(
    @inject(TYPES.IVendorMdRequestRepository)
    private readonly repository: IVendorMdRequestRepository,

    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository,

    @inject(TYPES.IVendorWorkflowService)
    private readonly workflowService: IVendorWorkflowService,
  ) {}

  async createMdRequest(input: any) {
    if (!input.vendorId?.trim()) {
      throw new Error(ErrorInfo.VENDOR_ID_REQUIRED);
    }

    const vendor = await this.vendorRepository.findById(input.vendorId);
    if (!vendor) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    // Vendor must be in INTERESTED status to send to MD
    // if (vendor.status !== VendorStatus.INTERESTED) {
    //   throw new Error('Vendor must be in INTERESTED status to send to MD');
    // }

    // Check if there's already a pending request for this vendor
    const existingPending = await this.repository.findPendingByVendorId(input.vendorId);
    if (existingPending) {
      throw new Error('A pending MD request already exists for this vendor');
    }

    const empId = input.empId || getCurrentEmail() || 'SYSTEM';

    const saved = await this.repository.createMdRequest({
      vendorId: input.vendorId,
      empId,
      empRemark: input.empRemark || null,
    });

    // Transition vendor to PENDING_MD_APPROVAL
    await this.workflowService.changeStatus(
      input.vendorId,
      VendorStatus.PENDING_MD_APPROVAL,
      input.empRemark || 'Sent to MD for approval',
    );

    return this.repository.findById(saved.id);
  }

  async resolveMdRequest(input: any) {
    if (!input.requestId?.trim()) {
      throw new Error('Request ID is required');
    }

    const request = await this.repository.findById(input.requestId);
    if (!request) {
      throw new Error('MD request not found');
    }

    if (request.isResolved) {
      throw new Error('MD request is already resolved');
    }

    const mdId = input.mdId || getCurrentEmail() || 'SYSTEM';

    await this.repository.markResolved(request.id, {
      isResolved: true,
      mdId,
      mdRemark: input.mdRemark || null,
    });

    // Transition vendor based on MD decision
    const newStatus = input.approved
      ? VendorStatus.APPROVED
      : VendorStatus.NOT_INTERESTED;

    await this.workflowService.changeStatus(
      request.vendorId,
      newStatus,
      input.mdRemark || (input.approved ? 'Approved by MD' : 'Rejected by MD'),
    );

    return this.repository.findById(request.id);
  }

  async getPendingRequests() {
    return this.repository.findPending();
  }

  async getResolvedRequests() {
    return this.repository.findResolved();
  }

  async getMdRequestsByVendor(vendorId: string) {
    return this.repository.findByVendorId(vendorId);
  }

  async getActivePendingRequest(vendorId: string) {
    return this.repository.findPendingByVendorId(vendorId);
  }
}
