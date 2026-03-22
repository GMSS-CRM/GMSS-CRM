import { gql } from 'graphql-tag';

export const searchTypeDefs = gql`
  extend type Query {
    searchTenders(searchTerm: String!, includeExpired: Boolean): [Tender!]!
    searchTickets(searchTerm: String!): [Ticket!]!
  }
`;
