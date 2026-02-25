import { inject, injectable } from 'inversify';
import { TYPES } from '../../inversify/types';
import {
  IVendorAgreementRepository,
  IVendorAgreementService,
} from './types';
import ErrorInfo from '../common/error-info';
import { getCurrentEmail } from '../common/utils';
import { IVendorProposalRepository } from '../vendor-proposal/types';
import { ProposalStatus } from '../../entities/VendorProposal';
import { IVendorWorkflowService } from '../vendor-workflow/types';
import { VendorStatus } from '../../entities/enums/VendorStatus';
import { SignatureStatus } from '../../entities/enums/SignatureStatus';
import { VendorAgreement } from '../../entities/VendorAgreement';

@injectable()
export class VendorAgreementService
  implements IVendorAgreementService
{
  constructor(
    @inject(TYPES.IVendorAgreementRepository)
    private readonly repository: IVendorAgreementRepository,

    @inject(TYPES.IVendorProposalRepository)
    private readonly proposalRepository: IVendorProposalRepository,

    @inject(TYPES.IVendorWorkflowService)
    private readonly workflowService: IVendorWorkflowService
  ) {}

  /* ===================================================== */
  /* CREATE AGREEMENT */
  /* ===================================================== */

  async createAgreement(input: any): Promise<VendorAgreement> {
    if (!input.vendorId) {
      throw new Error(ErrorInfo.AGREEMENT_VENDOR_ID_REQUIRED);
    }

    const proposals =
      await this.proposalRepository.findByVendorId(input.vendorId);

    const acceptedProposal = proposals.find(
      (p) => p.status === ProposalStatus.ACCEPTED
    );

    if (!acceptedProposal) {
      throw new Error(
        ErrorInfo.ACCEPTED_PROPOSAL_REQUIRED
      );
    }

    return this.repository.createAgreement({
      vendorId: input.vendorId,
      agreementStartDate: new Date(input.agreementStartDate),
      agreementEndDate: new Date(input.agreementEndDate),
      commissionType: input.commissionType,
      commissionValue: input.commissionValue,
      commissionStructure: input.commissionStructure,
      paymentFrequency: input.paymentFrequency,
      paymentAmount: input.paymentAmount,
      gstApplicable: input.gstApplicable ?? true,
      hasOtherBenefits: input.hasOtherBenefits ?? false,
      otherBenefitsDescription: input.otherBenefitsDescription,
      signatureStatus: SignatureStatus.PENDING,
      createdBy: getCurrentEmail(),
    });
  }

  /* ===================================================== */
  /* UPDATE SIGNATURE */
  /* ===================================================== */

  async updateSignature(input: any): Promise<VendorAgreement> {
    const agreement = await this.repository.findById(
      input.agreementId
    );

    if (!agreement) {
      throw new Error(ErrorInfo.AGREEMENT_NOT_FOUND);
    }

    const updated: VendorAgreement =
      await this.repository.updateAgreement(input.agreementId, {
        signatureStatus: input.signatureStatus,
        signedDate: input.signedDate
          ? new Date(input.signedDate)
          : new Date(),
      });

    /* ============================= */
    /* AUTO MOVE TO FINAL IF SIGNED */
    /* ============================= */

    if (input.signatureStatus === SignatureStatus.SIGNED) {
      await this.workflowService.changeStatus(
        agreement.vendorId,
        VendorStatus.FINAL,
        'Agreement signed'
      );
    }

    return updated;
  }
}
