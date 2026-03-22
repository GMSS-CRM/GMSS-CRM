import { gql } from 'graphql-tag';

export const tagAutoMailRestrictionTypeDefs = gql`
  type TagAutoMailRestriction {
    id: ID!
    tagId: ID!
    vendorId: ID!
    createdBy: String!
    createdDate: String!
  }

  extend type Query {
    getAutoMailRestrictions(tagId: ID!): [TagAutoMailRestriction!]!
    getAutoMailRestrictionsByVendor(vendorId: ID!): [TagAutoMailRestriction!]!
  }

  extend type Mutation {
    addAutoMailRestriction(tagId: ID!, vendorId: ID!): TagAutoMailRestriction!
    removeAutoMailRestriction(id: ID!): Boolean!
    removeAutoMailRestrictionByTagAndVendor(tagId: ID!, vendorId: ID!): Boolean!
  }
`;
