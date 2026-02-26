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
  | "MAIL_SENT";

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
  PENDING_MD_TAGGING: ["READY_FOR_NIT", "MD_TAGGED", "REJECTED"],
  READY_FOR_NIT: ["NIT_UPLOADED", "REJECTED"],
  MD_TAGGED: ["NIT_UPLOADED"],
  REJECTED: ["DRAFT", "PENDING_MD_TAGGING"],
  NIT_UPLOADED: ["PENDING_MD_TAGGING", "NIT_VERIFIED"],
  NIT_VERIFIED: ["DOCS_UPLOADED"],
  DOCS_UPLOADED: ["READY_TO_MAIL"],
  READY_TO_MAIL: ["MAIL_SENT"],
  MAIL_SENT: [],
};

// Role-based allowed status targets
export const ROLE_CAN_SET_STATUS: Record<UserRole, TenderStatus[]> = {
  USER: ["DRAFT", "PENDING_MD_TAGGING", "NIT_UPLOADED", "DOCS_UPLOADED", "READY_TO_MAIL", "MAIL_SENT"],
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
};

export const STATUS_LABELS: Record<TenderStatus, string> = {
  DRAFT: "Draft",
  PENDING_MD_TAGGING: "Pending MD Tagging",
  READY_FOR_NIT: "Ready for NIT Upload (MD Approved)",
  MD_TAGGED: "MD Tagged",
  REJECTED: "Rejected",
  NIT_UPLOADED: "NIT Uploaded",
  NIT_VERIFIED: "NIT Verified",
  DOCS_UPLOADED: "Documents Uploaded",
  READY_TO_MAIL: "Ready to Mail",
  MAIL_SENT: "Mail Sent",
};

// Tab configuration for each role
export interface TabConfig {
  key: string;
  label: string;
  statuses: TenderStatus[];
  icon?: string;
}

export const USER_TABS: TabConfig[] = [
  { key: "draft", label: "Draft", statuses: ["DRAFT", "REJECTED"] },
  { key: "sentToMd", label: "Sent to MD", statuses: ["PENDING_MD_TAGGING"] },
  { key: "nitPending", label: "NIT Pending", statuses: ["READY_FOR_NIT", "MD_TAGGED", "NIT_UPLOADED"] },
  { key: "docsPending", label: "Docs Pending", statuses: ["NIT_VERIFIED", "DOCS_UPLOADED"] },
  { key: "readyToMail", label: "Ready to Mail", statuses: ["READY_TO_MAIL"] },
  { key: "completed", label: "Completed", statuses: ["MAIL_SENT"] },
];

export const MD_TABS: TabConfig[] = [
  { key: "pendingApproval", label: "Pending Approval", statuses: ["PENDING_MD_TAGGING"] },
  { key: "pendingTagging", label: "Pending Tagging", statuses: ["NIT_UPLOADED"] },
  { key: "nitVerification", label: "NIT Verification", statuses: ["NIT_VERIFIED"] },
  { key: "mdCompleted", label: "Completed", statuses: ["MD_TAGGED", "DOCS_UPLOADED", "READY_TO_MAIL", "MAIL_SENT"] },
];

// Document type options
export const DOCUMENT_TYPES = [
  { value: "TECHNICAL", label: "Technical Document" },
  { value: "FINANCIAL", label: "Financial Document" },
  { value: "OTHER", label: "Other Document" },
] as const;