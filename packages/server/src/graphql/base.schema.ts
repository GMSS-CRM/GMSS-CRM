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
    REJECTED
  }

  enum ApprovalStatus {
    PENDING
    APPROVED
    REJECTED
  }

  enum ProposalStatus {
    DRAFT
    SENT
    ACCEPTED
    REJECTED
  }

  enum FollowUpType {
    EMAIL
    CALL
    MEETING
    OTHER
  }

  enum PaymentFrequency {
    MONTHLY
    QUARTERLY
    SEMI_ANNUAL
    ANNUAL
  }

  enum CommissionType {
    PERCENTAGE
    FIXED
    TIERED
  }

  enum CommissionStructure {
    SIMPLE
    TIERED
    HYBRID
  }

  enum TenderParticipationStatus {
    PARTICIPATED
    QUOTED
    WON
    LOST
  }
`;
