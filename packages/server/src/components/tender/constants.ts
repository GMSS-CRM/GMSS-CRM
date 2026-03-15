import { TenderStatus } from '../../entities/enums/TenderStatus';

/**
 * Valid tender status transitions.
 * Key = current status, value = allowed next statuses.
 */
export const VALID_TENDER_TRANSITIONS: Record<TenderStatus, TenderStatus[]> = {
  [TenderStatus.DRAFT]: [TenderStatus.PENDING_MD_TAGGING],
  // When a tender is sent to MD it can either be approved for NIT upload
  // (READY_FOR_NIT), rejected, or (optionally) directly tagged by MD.
  [TenderStatus.PENDING_MD_TAGGING]: [TenderStatus.READY_FOR_NIT, TenderStatus.MD_TAGGED, TenderStatus.REJECTED],

  // After MD approves for NIT upload, the tender moves to READY_FOR_NIT.
  // From READY_FOR_NIT the user can upload the NIT or MD can reject.
  [TenderStatus.READY_FOR_NIT]: [TenderStatus.NIT_UPLOADED, TenderStatus.REJECTED],

  // After MD approves, the user uploads NIT. After NIT upload the tender
  // moves back into MD's queue for tagging (we model that by allowing
  // NIT_UPLOADED -> PENDING_MD_TAGGING below).
  [TenderStatus.MD_TAGGED]: [TenderStatus.NIT_UPLOADED],
  [TenderStatus.REJECTED]: [TenderStatus.DRAFT, TenderStatus.PENDING_MD_TAGGING],
  // Allow NIT upload to transition back to MD for tagging.
  [TenderStatus.NIT_UPLOADED]: [TenderStatus.PENDING_MD_TAGGING, TenderStatus.NIT_VERIFIED],
  [TenderStatus.NIT_VERIFIED]: [TenderStatus.DOCS_UPLOADED, TenderStatus.READY_TO_MAIL],
  [TenderStatus.DOCS_UPLOADED]: [TenderStatus.READY_TO_MAIL],
  [TenderStatus.READY_TO_MAIL]: [TenderStatus.MAIL_SENT],
  [TenderStatus.MAIL_SENT]: [TenderStatus.VENDOR_FOLLOWUP],

  /* ── Post-mail workflow transitions ────────────────────── */
  [TenderStatus.VENDOR_FOLLOWUP]: [TenderStatus.QUOTE_COLLECTION, TenderStatus.REJECTED],
  [TenderStatus.QUOTE_COLLECTION]: [TenderStatus.TENDER_PREPARATION, TenderStatus.REJECTED],
  [TenderStatus.TENDER_PREPARATION]: [TenderStatus.PARTICIPATED, TenderStatus.REJECTED],
  [TenderStatus.PARTICIPATED]: [TenderStatus.ORDER_FOLLOWUP, TenderStatus.REJECTED],
  [TenderStatus.ORDER_FOLLOWUP]: [TenderStatus.ORDER_PROCESSING],
  [TenderStatus.ORDER_PROCESSING]: [TenderStatus.INSPECTION, TenderStatus.DISPATCH],
  [TenderStatus.INSPECTION]: [TenderStatus.DISPATCH],
  [TenderStatus.DISPATCH]: [TenderStatus.DELIVERY],
  [TenderStatus.DELIVERY]: [TenderStatus.WARRANTY, TenderStatus.BILL_SUBMISSION],
  [TenderStatus.WARRANTY]: [TenderStatus.BILL_SUBMISSION],
  [TenderStatus.BILL_SUBMISSION]: [TenderStatus.PAYMENT],
  [TenderStatus.PAYMENT]: [TenderStatus.SD_RELEASE, TenderStatus.COMPLETED],
  [TenderStatus.SD_RELEASE]: [TenderStatus.COMPLETED],
  [TenderStatus.COMPLETED]: [],
};
