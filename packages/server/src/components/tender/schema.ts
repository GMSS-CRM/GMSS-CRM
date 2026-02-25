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
  }

  input UpdateTenderInput {
    name: String
    referenceNumber: String
    issuingDepartment: String
    description: String
    submissionDeadline: String
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
    searchTenders(searchInput: SearchTenderInput): [Tender!]!
  }

  extend type Mutation {
    createTender(input: CreateTenderInput!): Tender!
    updateTender(id: ID!, input: UpdateTenderInput!): Tender!
    deleteTender(id: ID!): Boolean!
    deleteTenders(ids: [ID!]!): Boolean!
    changeTenderStatus(input: ChangeTenderStatusInput!): Tender!
  }
`;
