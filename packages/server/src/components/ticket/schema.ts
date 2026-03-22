import { gql } from 'graphql-tag';

export const ticketTypeDefs = gql`
  enum TicketPriority {
    HIGH
    MEDIUM
    LOW
  }

  enum TicketStatus {
    OPEN
    IN_PROGRESS
    CLOSED
  }

  type Ticket {
    id: ID!
    title: String!
    description: String
    priority: TicketPriority!
    status: TicketStatus!
    assignedTo: String
    assignedBy: String
    referenceId: String
    referenceType: String
    createdDate: String!
    updatedDate: String!
  }

  input CreateTicketInput {
    title: String!
    description: String
    priority: TicketPriority
    assignedTo: String
    assignedBy: String
    referenceId: String
    referenceType: String
  }

  input UpdateTicketInput {
    title: String
    description: String
    priority: TicketPriority
    status: TicketStatus
    assignedTo: String
  }

  extend type Query {
    getTickets: [Ticket!]!
    getTicketById(id: ID!): Ticket
    getTicketsByAssignee(userId: String!): [Ticket!]!
  }

  extend type Mutation {
    createTicket(input: CreateTicketInput!): Ticket!
    updateTicket(id: ID!, input: UpdateTicketInput!): Ticket!
    deleteTicket(id: ID!): Boolean!
  }
`;
