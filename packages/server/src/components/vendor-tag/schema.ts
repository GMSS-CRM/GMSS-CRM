import { gql } from 'graphql-tag';

export const vendorTagTypeDefs = gql`
  type VendorTag {
    id: ID!
    vendorId: ID!
    tagId: ID!
    enableMail: Boolean!
    tag: Tag
    createdBy: String!
    createdDate: String!
  }

  input CreateVendorTagInput {
    vendorId: ID!
    tagId: ID!
    enableMail: Boolean
  }

  extend type Query {
    getVendorsByTag(tagId: ID!): [Vendor!]!
  }

  extend type Mutation {
    createVendorTag(input: CreateVendorTagInput!): VendorTag!
    deleteVendorTag(id: ID!): Boolean!
  }
`;
