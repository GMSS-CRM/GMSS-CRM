export enum VendorStatus {
  NEW = 'NEW',
  INTERESTED = 'INTERESTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
  PENDING_MD_APPROVAL = 'PENDING_MD_APPROVAL',
  APPROVED = 'APPROVED',
  FINAL = 'FINAL',
  DELETED = 'DELETED',
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PENDING_RESPONSE = 'PENDING_RESPONSE',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum SignatureStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
}

export enum CommissionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum CommissionStructure {
  SPLIT_50_50 = 'SPLIT_50_50',
  FULL_ON_PAYMENT = 'FULL_ON_PAYMENT',
}

export enum PaymentFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum FollowUpType {
  PROPOSAL = 'PROPOSAL',
  AGREEMENT = 'AGREEMENT',
  DOCUMENT = 'DOCUMENT',
  RENEWAL = 'RENEWAL',
  PAYMENT = 'PAYMENT',
}
