import { gql } from 'graphql-tag';

export const tenderTypeDefs = gql`
  type Tender {
    id: ID!
    name: String!
    referenceNumber: String
    issuingDepartment: String
    description: String
    status: TenderStatus!
    submissionDeadline: String
    rejectionReason: String
    mailSentAt: String
    sourcePortal: SourcePortal
    tenderType: TenderTypeEnum
    isLoadedOnPortal: Boolean
    agApprovalRequired: Boolean
    isFeasible: Boolean
    feasibilityRemarks: String
    closingDateChanged: Boolean
    closingDateProofUrl: String
    updatedSubmissionDeadline: String
    mailCheckProofUrl: String
    countdownSilenceReason: String
    drawingRequired: Boolean
    strRequired: Boolean
    specificationsRequired: Boolean
    isDeleted: Boolean
    deletedBy: String
    deletedDate: String
    createdBy: String!
    createdDate: String!
    updatedBy: String
    updatedDate: String!
    documents: [TenderDocument!]
    tags: [TenderTag!]
  }

  type TenderDocument {
    id: ID!
    tenderId: ID!
    documentName: String!
    documentUrl: String!
    expiresOn: String
    createdBy: String!
    createdDate: String!
  }

  type TenderTag {
    id: ID!
    tenderId: ID!
    tagId: ID!
    tag: Tag
  }

  input CreateTenderInput {
    name: String!
    referenceNumber: String
    issuingDepartment: String
    description: String
    submissionDeadline: String
    sourcePortal: SourcePortal
    tenderType: TenderTypeEnum
  }

  input UpdateTenderInput {
    name: String
    referenceNumber: String
    issuingDepartment: String
    description: String
    submissionDeadline: String
    sourcePortal: SourcePortal
    tenderType: TenderTypeEnum
    isLoadedOnPortal: Boolean
    agApprovalRequired: Boolean
    isFeasible: Boolean
    feasibilityRemarks: String
    closingDateChanged: Boolean
    closingDateProofUrl: String
    updatedSubmissionDeadline: String
    mailCheckProofUrl: String
    drawingRequired: Boolean
    strRequired: Boolean
    specificationsRequired: Boolean
  }

  input SearchTenderInput {
    search: String
    status: TenderStatus
    limit: Int
    offset: Int
  }

  input ChangeTenderStatusInput {
    tenderId: ID!
    status: TenderStatus!
    rejectionReason: String
    tagIds: [ID!]
  }

  extend type Query {
    getTenderById(id: ID!): Tender
    searchTendersAdvanced(searchInput: SearchTenderInput): [Tender!]!
  }

  type SkippedTenderInfo {
    name: String!
    referenceNumber: String
    reason: String!
  }

  type CreateTendersBatchResult {
    created: [Tender!]!
    skipped: [SkippedTenderInfo!]!
  }

  extend type Mutation {
    createTender(input: CreateTenderInput!): Tender!
    createTendersBatch(inputs: [CreateTenderInput!]!): CreateTendersBatchResult!
    updateTender(id: ID!, input: UpdateTenderInput!): Tender!
    deleteTender(id: ID!): Boolean!
    deleteTenders(ids: [ID!]!): Boolean!
    changeTenderStatus(input: ChangeTenderStatusInput!): Tender!
    seedTenderVendors(tenderId: ID!): Boolean!
    silenceTenderCountdown(tenderId: ID!, reason: TenderStatus!, newDeadline: String, remarks: String): Tender!
    checkTenderDeadlineReminders: Int!
  }
`;
