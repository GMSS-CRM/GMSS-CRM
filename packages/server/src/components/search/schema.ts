import { gql } from 'graphql-tag';

export const searchTypeDefs = gql`
  extend type Query {
    searchTenders(searchTerm: String!): [Tender!]!
    searchVendors(searchTerm: String!): [Vendor!]!
  }
`;
