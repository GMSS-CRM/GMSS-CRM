// packages/client/src/features/tender-workflow/types/tender.types.ts

export type TenderStatus =
  | "DRAFT"
  | "READY_FOR_NIT"
  | "PENDING_MD_TAGGING"
  | "MD_TAGGED"
  | "REJECTED"
  | "NIT_UPLOADED"
  | "NIT_VERIFIED"
  | "DOCS_UPLOADED"
  | "READY_TO_MAIL"
  | "MAIL_SENT"
  | "VENDOR_FOLLOWUP"
  | "QUOTE_COLLECTION"
  | "TENDER_PREPARATION"
  | "PARTICIPATED"
  | "ORDER_FOLLOWUP"
  | "ORDER_PROCESSING"
  | "INSPECTION"
  | "DISPATCH"
  | "DELIVERY"
  | "WARRANTY"
  | "BILL_SUBMISSION"
  | "PAYMENT"
  | "SD_RELEASE"
  | "COMPLETED";

export type UserRole = "USER" | "MD";

export interface TenderTag {
  id: string;
  name: string;
  color: string;
}

export interface TenderDocument {
  id: string;
  name: string;
  type: "NIT" | "TECHNICAL" | "FINANCIAL" | "OTHER";
  uploadedAt: Date;
  url?: string;
  size?: number;
}

export interface Tender {
  id: string;
  name: string;
  referenceNumber: string;
  issuingDepartment: string;
  description?: string;
  status: TenderStatus;
  tags: TenderTag[];
  documents: TenderDocument[];
  nitDocument?: TenderDocument;
  createdAt: Date;
  updatedAt: Date;
  submissionDeadline?: Date;
  rejectionReason?: string;
  mailSentAt?: Date;
}

/** Input type for creating / updating a Tender (excludes auto-generated fields) */
export type TenderFormData = Omit<Tender, 'id' | 'createdAt' | 'updatedAt'>;

export interface ExcelTenderRow {
  key: string;
  name: string;
  referenceNumber: string;
  issuingDepartment: string;
  estimatedValue: number;
  description?: string;
  publishDate?: string;
  submissionDeadline?: string;
}

export interface TenderWorkflowItem {
  id: string;
  department: string;
  tenderNo: string;
  tenderTitle: string;
  statusFromExcel: string;
  openingDateTime: string;
  dueDateTime: string;
  dueDays: number;
  workflowStatus: "DRAFT";
}

export interface TenderWorkflowState {
  tenders: Tender[];
  previewData: TenderWorkflowItem[];
  selectedPreviewKeys: React.Key[];
  isLoading: boolean;
  activeDrawerTender: Tender | null;
  isDrawerOpen: boolean;
}

// Status transition map - defines valid transitions
export const STATUS_TRANSITIONS: Record<TenderStatus, TenderStatus[]> = {
  DRAFT: ["PENDING_MD_TAGGING"],
  PENDING_MD_TAGGING: ["READY_FOR_NIT", "REJECTED"],
  READY_FOR_NIT: ["NIT_UPLOADED", "REJECTED"],
  MD_TAGGED: ["NIT_UPLOADED"],
  REJECTED: ["DRAFT", "PENDING_MD_TAGGING"],
  NIT_UPLOADED: ["NIT_VERIFIED"],
  NIT_VERIFIED: ["DOCS_UPLOADED", "READY_TO_MAIL"],
  DOCS_UPLOADED: ["READY_TO_MAIL"],
  READY_TO_MAIL: ["MAIL_SENT"],
  MAIL_SENT: ["VENDOR_FOLLOWUP"],
  VENDOR_FOLLOWUP: ["QUOTE_COLLECTION", "REJECTED"],
  QUOTE_COLLECTION: ["TENDER_PREPARATION", "REJECTED"],
  TENDER_PREPARATION: ["PARTICIPATED", "REJECTED"],
  PARTICIPATED: ["ORDER_FOLLOWUP", "REJECTED"],
  ORDER_FOLLOWUP: ["ORDER_PROCESSING"],
  ORDER_PROCESSING: ["INSPECTION", "DISPATCH"],
  INSPECTION: ["DISPATCH"],
  DISPATCH: ["DELIVERY"],
  DELIVERY: ["WARRANTY", "BILL_SUBMISSION"],
  WARRANTY: ["BILL_SUBMISSION"],
  BILL_SUBMISSION: ["PAYMENT"],
  PAYMENT: ["SD_RELEASE", "COMPLETED"],
  SD_RELEASE: ["COMPLETED"],
  COMPLETED: [],
};

// Role-based allowed status targets
export const ROLE_CAN_SET_STATUS: Record<UserRole, TenderStatus[]> = {
  USER: [
    "DRAFT", "PENDING_MD_TAGGING", "NIT_UPLOADED", "DOCS_UPLOADED", "READY_TO_MAIL", "MAIL_SENT",
    "VENDOR_FOLLOWUP", "QUOTE_COLLECTION", "TENDER_PREPARATION", "PARTICIPATED",
    "ORDER_FOLLOWUP", "ORDER_PROCESSING", "INSPECTION", "DISPATCH", "DELIVERY",
    "WARRANTY", "BILL_SUBMISSION", "PAYMENT", "SD_RELEASE", "COMPLETED",
  ],
  MD: ["MD_TAGGED", "REJECTED", "NIT_VERIFIED", "READY_FOR_NIT"],
};

export const STATUS_COLORS: Record<TenderStatus, string> = {
  DRAFT: "default",
  PENDING_MD_TAGGING: "warning",
  READY_FOR_NIT: "gold",
  MD_TAGGED: "processing",
  REJECTED: "error",
  NIT_UPLOADED: "purple",
  NIT_VERIFIED: "cyan",
  DOCS_UPLOADED: "success",
  READY_TO_MAIL: "gold",
  MAIL_SENT: "success",
  VENDOR_FOLLOWUP: "processing",
  QUOTE_COLLECTION: "warning",
  TENDER_PREPARATION: "gold",
  PARTICIPATED: "cyan",
  ORDER_FOLLOWUP: "purple",
  ORDER_PROCESSING: "processing",
  INSPECTION: "warning",
  DISPATCH: "gold",
  DELIVERY: "cyan",
  WARRANTY: "error",
  BILL_SUBMISSION: "purple",
  PAYMENT: "processing",
  SD_RELEASE: "gold",
  COMPLETED: "success",
};

export const STATUS_LABELS: Record<TenderStatus, string> = {
  DRAFT: "Draft",
  PENDING_MD_TAGGING: "Pending MD Approval",
  READY_FOR_NIT: "Ready for NIT Upload (MD Approved)",
  MD_TAGGED: "MD Tagged",
  REJECTED: "Rejected",
  NIT_UPLOADED: "NIT Uploaded",
  NIT_VERIFIED: "NIT Verified",
  DOCS_UPLOADED: "Documents Uploaded",
  READY_TO_MAIL: "Ready to Mail",
  MAIL_SENT: "Mail Sent",
  VENDOR_FOLLOWUP: "Vendor Follow-Up",
  QUOTE_COLLECTION: "Quote Collection",
  TENDER_PREPARATION: "Tender Preparation",
  PARTICIPATED: "Participated",
  ORDER_FOLLOWUP: "Order Follow-Up",
  ORDER_PROCESSING: "Order Processing",
  INSPECTION: "Inspection",
  DISPATCH: "Dispatch",
  DELIVERY: "Delivery",
  WARRANTY: "Warranty",
  BILL_SUBMISSION: "Bill Submission",
  PAYMENT: "Payment",
  SD_RELEASE: "SD Release",
  COMPLETED: "Completed",
};

// Tab configuration for each role
export interface TabConfig {
  key: string;
  label: string;
  statuses: TenderStatus[];
  icon?: string;
}

export const USER_TABS: TabConfig[] = [
  { key: "nitPending", label: "NIT Pending", statuses: ["READY_FOR_NIT", "MD_TAGGED"] },
  { key: "docsPending", label: "Docs Pending", statuses: ["NIT_VERIFIED", "DOCS_UPLOADED"] },
  { key: "readyToMail", label: "Ready to Mail", statuses: ["READY_TO_MAIL"] },
  { key: "mailSent", label: "Mail Sent", statuses: ["MAIL_SENT"] },
  { key: "vendorFollowUp", label: "Vendor Follow-Up", statuses: ["VENDOR_FOLLOWUP", "QUOTE_COLLECTION", "TENDER_PREPARATION"] },
  { key: "participated", label: "Participated", statuses: ["PARTICIPATED"] },
  { key: "postAward", label: "Post-Award", statuses: ["ORDER_FOLLOWUP", "ORDER_PROCESSING", "INSPECTION", "DISPATCH", "DELIVERY", "WARRANTY", "BILL_SUBMISSION", "PAYMENT", "SD_RELEASE"] },
  { key: "completed", label: "Completed", statuses: ["COMPLETED"] },
];

export const MD_TABS: TabConfig[] = [
  { key: "pendingApproval", label: "Pending Approval", statuses: ["PENDING_MD_TAGGING"] },
  { key: "pendingTagging", label: "Pending Tagging", statuses: ["NIT_UPLOADED"] },
  { key: "postAward", label: "Post-Award", statuses: ["ORDER_FOLLOWUP", "ORDER_PROCESSING", "INSPECTION", "DISPATCH", "DELIVERY", "WARRANTY", "BILL_SUBMISSION", "PAYMENT", "SD_RELEASE"] },
  { key: "completed", label: "Completed", statuses: ["MAIL_SENT", "COMPLETED"] },
];

// Document type options
export const DOCUMENT_TYPES = [
  { value: "TECHNICAL", label: "Technical Document" },
  { value: "FINANCIAL", label: "Financial Document" },
  { value: "OTHER", label: "Other Document" },
] as const;