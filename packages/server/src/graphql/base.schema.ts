import { gql } from 'graphql-tag';

export const baseTypeDefs = gql`
  enum Permission {
    READ_USER
    CREATE_USER
    UPDATE_USER
    DELETE_USER

    READ_ROLE
    CREATE_ROLE
    UPDATE_ROLE
    DELETE_ROLE

    READ_APP_SETTING
    UPDATE_APP_SETTING
  }

  enum VendorStatus {
    NEW
    INTERESTED
    NOT_INTERESTED
    PENDING_MD_APPROVAL
    APPROVED
    FINAL
    DELETED
  }

  enum VendorType {
    Consultant
    Vendor
  }

  enum CompanyType {
    Approved
    Draft
    Rejected
    Submitted
  }

  enum SignatureStatus {
    PENDING
    SIGNED
    EXPIRED
  }

  enum ApprovalStatus {
    PENDING
    APPROVED
    REJECTED
  }

  enum ProposalStatus {
    DRAFT
    SENT
    PENDING_RESPONSE
    ACCEPTED
    REJECTED
  }

  enum FollowUpType {
    EMAIL
    HARD_COPY_COURIER
    DIGITAL_SIGNATURE_COURIER
  }

  enum FollowUpStatus {
    PENDING
    YES_RECEIVED
    COURIER_DISPATCHED
    COMPLETED
  }

  enum PaymentFrequency {
    MONTHLY
    QUARTERLY
    YEARLY
  }

  enum CommissionType {
    PERCENTAGE
    FIXED
  }

  enum CommissionStructure {
    SPLIT_50_50
    FULL_ON_PAYMENT
  }

  enum TenderParticipationStatus {
    PENDING
    PARTICIPATED
    REJECTED
  }

  enum TenderStatus {
    DRAFT
    PENDING_MD_TAGGING
    READY_FOR_NIT
    MD_TAGGED
    REJECTED
    NIT_UPLOADED
    NIT_VERIFIED
    DOCS_UPLOADED
    READY_TO_MAIL
    MAIL_SENT
    VENDOR_FOLLOWUP
    QUOTE_COLLECTION
    TENDER_PREPARATION
    PARTICIPATED
    ORDER_FOLLOWUP
    ORDER_PROCESSING
    INSPECTION
    DISPATCH
    DELIVERY
    WARRANTY
    BILL_SUBMISSION
    PAYMENT
    SD_RELEASE
    COMPLETED
  }
`;
