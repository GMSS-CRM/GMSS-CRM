import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IVendorProposalRepository,
  IVendorProposalService,
} from './types';
import { ProposalStatus, VendorProposal } from '../../entities/VendorProposal';
import ErrorInfo from '../common/error-info';
import { IVendorRepository } from '../vendor/types';
import { IVendorAgreementService } from '../vendor-agreement/types';
import { IVendorFollowUpService } from '../vendor-followup/types';
import { VALID_PROPOSAL_TRANSITIONS } from './constants';
import { getCurrentEmail } from '../common/utils';
import { VendorStatus } from '../../entities/enums/VendorStatus';

@injectable()
export class VendorProposalService
  implements IVendorProposalService
{
  constructor(
    @inject(TYPES.IVendorProposalRepository)
    private readonly repository: IVendorProposalRepository,

    @inject(TYPES.IVendorRepository)
    private readonly vendorRepository: IVendorRepository,

    @inject(TYPES.IVendorAgreementService)
    private readonly agreementService: IVendorAgreementService,

    @inject(TYPES.IVendorFollowUpService)
    private readonly followUpService: IVendorFollowUpService
  ) {}

  async createProposal(input: any): Promise<VendorProposal> {
    const vendor = await this.vendorRepository.findById(
      input.vendorId
    );

    if (!vendor || vendor.isDeleted) {
      throw new Error(ErrorInfo.VENDOR_NOT_FOUND);
    }

    if (vendor.status !== VendorStatus.APPROVED) {
      throw new Error(
        ErrorInfo.PROPOSAL_ALREADY_EXISTS
      );
    }

    return this.repository.createProposal({
      vendorId: input.vendorId,
      status: ProposalStatus.DRAFT,
      remarks: input.remarks,
    });
  }

  async updateProposalStatus(input: any): Promise<VendorProposal> {
    const proposal = await this.repository.findById(
      input.proposalId
    );

    if (!proposal) {
      throw new Error(ErrorInfo.PROPOSAL_NOT_FOUND);
    }

    const allowed =
      VALID_PROPOSAL_TRANSITIONS[proposal.status];

    if (!allowed.includes(input.status)) {
      throw new Error(
        `Invalid transition from ${proposal.status} to ${input.status}`
      );
    }

    const updated = await this.repository.updateProposal(
      input.proposalId,
      {
        status: input.status,
        followUpDate: input.followUpDate
          ? new Date(input.followUpDate)
          : undefined,
        remarks: input.remarks,
      }
    );

    // 🔥 Auto-create follow-up when SENT
    if (input.status === ProposalStatus.SENT) {
      await this.followUpService.createFollowUp({
        vendorId: proposal.vendorId,
        type: 'PROPOSAL',
        nextFollowUpDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
        remarks: 'Follow up on sent proposal',
      });
    }

    // 🔥 ACCEPTED → auto-create agreement
    if (input.status === ProposalStatus.ACCEPTED) {
      await this.agreementService.createAgreement({
        vendorId: proposal.vendorId,
        agreementStartDate: new Date(),
        agreementEndDate: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
        gstApplicable: true,
        hasOtherBenefits: false,
      });
    }

    return updated;
  }
}
