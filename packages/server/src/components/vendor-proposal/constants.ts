import { ProposalStatus } from '../../entities/VendorProposal';

export const VALID_PROPOSAL_TRANSITIONS: Record<
  ProposalStatus,
  ProposalStatus[]
> = {
  [ProposalStatus.DRAFT]: [ProposalStatus.SENT],

  [ProposalStatus.SENT]: [
    ProposalStatus.PENDING_RESPONSE,
    ProposalStatus.ACCEPTED,
    ProposalStatus.REJECTED,
  ],

  [ProposalStatus.PENDING_RESPONSE]: [
    ProposalStatus.ACCEPTED,
    ProposalStatus.REJECTED,
  ],

  [ProposalStatus.ACCEPTED]: [],

  [ProposalStatus.REJECTED]: [],
};
