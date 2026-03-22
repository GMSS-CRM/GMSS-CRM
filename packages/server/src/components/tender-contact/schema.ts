import { gql } from 'graphql-tag';

export const tenderContactTypeDefs = gql`
  enum TenderContactType {
    DEPARTMENT
    OFFICER
    CONSIGNEE
    ACCOUNTS_OFFICER
    SD_OFFICER
  }

  type TenderContact {
    id: ID!
    tenderId: ID!
    contactType: TenderContactType!
    name: String!
    designation: String
    phone: String
    email: String
    isActive: Boolean!
    createdDate: String!
    updatedDate: String!
  }

  input CreateTenderContactInput {
    tenderId: ID!
    contactType: TenderContactType!
    name: String!
    designation: String
    phone: String
    email: String
  }

  input UpdateTenderContactInput {
    contactType: TenderContactType
    name: String
    designation: String
    phone: String
    email: String
    isActive: Boolean
  }

  extend type Query {
    getTenderContacts(tenderId: ID!): [TenderContact!]!
  }

  extend type Mutation {
    createTenderContact(input: CreateTenderContactInput!): TenderContact!
    updateTenderContact(id: ID!, input: UpdateTenderContactInput!): TenderContact!
    deleteTenderContact(id: ID!): Boolean!
  }
`;
