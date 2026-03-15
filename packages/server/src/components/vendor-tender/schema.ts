import { gql } from 'graphql-tag';

export const vendorTenderTypeDefs = gql`
  enum VendorInterestStatus {
    PENDING
    INTERESTED
    NOT_INTERESTED
  }

  enum EmdSource {
    NEFT
    BG
    FDR
    DD
  }

  enum TabulationType {
    FINANCIAL
    TECHNICAL
    BOTH
  }

  type VendorTender {
    id: ID!
    vendorId: ID!
    tenderId: ID!
    sharedDate: String
    isParticipating: Boolean!
    participationStatus: TenderParticipationStatus!

    # Follow-Up tracking
    interestStatus: VendorInterestStatus!
    notInterestedReason: String

    # Per company-type steps
    proposalShared: Boolean!          # New companies: share GMSS proposal
    tieUpAgreementObtained: Boolean!  # Interested + New companies

    # Quote
    quoteReceived: Boolean!
    quoteUrl: String
    quotedAmount: Float
    quoteApproved: Boolean!

    # Documents
    companyDocsUploaded: Boolean!
    tenderDocsUploaded: Boolean!

    # EMD
    emdRequired: Boolean!
    emdSource: EmdSource
    emdAmount: Float
    emdPaid: Boolean!

    # Tabulations
    tabulationType: TabulationType
    tabulationUploaded: Boolean!
    tabulationApproved: Boolean!

    # Decision
    participationDecisionReason: String
    followUpRemarks: String

    createdDate: String!
    updatedDate: String!
    tender: Tender
    vendor: Vendor
  }

  input ParticipateInTenderInput {
    vendorId: ID!
    tenderId: ID!
    quotedAmount: Float
  }

  input UpdateTenderParticipationInput {
    participationId: ID!
    status: TenderParticipationStatus!
  }

  input UpdateVendorTenderFollowUpInput {
    id: ID!

    interestStatus: VendorInterestStatus
    notInterestedReason: String

    proposalShared: Boolean
    tieUpAgreementObtained: Boolean

    quoteReceived: Boolean
    quoteUrl: String
    quotedAmount: Float
    quoteApproved: Boolean

    companyDocsUploaded: Boolean
    tenderDocsUploaded: Boolean

    emdRequired: Boolean
    emdSource: EmdSource
    emdAmount: Float
    emdPaid: Boolean

    tabulationType: TabulationType
    tabulationUploaded: Boolean
    tabulationApproved: Boolean

    isParticipating: Boolean
    participationStatus: TenderParticipationStatus
    participationDecisionReason: String
    followUpRemarks: String
  }

  extend type Mutation {
    participateInTender(input: ParticipateInTenderInput!): VendorTender!
    updateTenderParticipation(input: UpdateTenderParticipationInput!): VendorTender!
    updateVendorTenderFollowUp(input: UpdateVendorTenderFollowUpInput!): VendorTender!
  }

  extend type Query {
    getVendorTenders(vendorId: ID!): [VendorTender!]!
    getSharedTenders(vendorId: ID!): [VendorTender!]!
    getTenderFollowUps(tenderId: ID!): [VendorTender!]!
  }
`;
