// Shared utilities for vendor follow-up components

export type FollowUpDraft = {
  interestStatus: string;
  notInterestedReason: string;
  proposalShared: boolean;
  tieUpAgreementObtained: boolean;
  quoteReceived: boolean;
  quoteUrl: string;
  quotedAmount: number | null;
  quoteApproved: boolean;
  companyDocsUploaded: boolean;
  tenderDocsUploaded: boolean;
  emdRequired: boolean;
  emdSource: string | null;
  emdAmount: number | null;
  emdPaid: boolean;
  tabulationType: string | null;
  tabulationUploaded: boolean;
  tabulationApproved: boolean;
  participationDecisionReason: string;
  followUpRemarks: string;
};

export function calcProgress(draft: FollowUpDraft, vendorType: string): { done: number; total: number } {
  const steps: boolean[] = [];
  if (vendorType === 'NEW') steps.push(draft.proposalShared);
  if (vendorType === 'NEW' || vendorType === 'INTERESTED') steps.push(draft.tieUpAgreementObtained);
  steps.push(draft.quoteReceived);
  steps.push(draft.quoteApproved);
  steps.push(draft.companyDocsUploaded);
  steps.push(draft.tenderDocsUploaded);
  if (draft.emdRequired) {
    steps.push(!!draft.emdSource);
    steps.push(draft.emdPaid);
  }
  steps.push(draft.tabulationUploaded);
  steps.push(draft.tabulationApproved);
  return { done: steps.filter(Boolean).length, total: steps.length };
}

export const INTEREST_STATUS_META: Record<string, { color: string; label: string }> = {
  PENDING:        { color: 'default', label: 'Pending' },
  INTERESTED:     { color: 'success', label: 'Interested' },
  NOT_INTERESTED: { color: 'error',   label: 'Not Interested' },
};
