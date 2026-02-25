import { TenderStatus } from '../../entities/enums/TenderStatus';

/**
 * Valid tender status transitions.
 * Key = current status, value = allowed next statuses.
 */
export const VALID_TENDER_TRANSITIONS: Record<TenderStatus, TenderStatus[]> = {
  [TenderStatus.DRAFT]: [TenderStatus.PENDING_MD_TAGGING],
  [TenderStatus.PENDING_MD_TAGGING]: [TenderStatus.MD_TAGGED, TenderStatus.REJECTED],
  [TenderStatus.MD_TAGGED]: [TenderStatus.NIT_UPLOADED],
  [TenderStatus.REJECTED]: [TenderStatus.DRAFT, TenderStatus.PENDING_MD_TAGGING],
  [TenderStatus.NIT_UPLOADED]: [TenderStatus.NIT_VERIFIED],
  [TenderStatus.NIT_VERIFIED]: [TenderStatus.DOCS_UPLOADED],
  [TenderStatus.DOCS_UPLOADED]: [TenderStatus.READY_TO_MAIL],
  [TenderStatus.READY_TO_MAIL]: [TenderStatus.MAIL_SENT],
  [TenderStatus.MAIL_SENT]: [],
};
