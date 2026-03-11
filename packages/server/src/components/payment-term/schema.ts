import { gql } from 'graphql-tag';

export const paymentTermTypeDefs = gql`
  type PaymentTerm {
    id: ID!
    vendorId: ID!
    companyType: String!
    paymentTermType: String!
    commissionStructure: String
    otherBenefits: Boolean!
    benefitDetails: String
    agreementDate: String
    fillAmount: String
    isActive: Boolean!
    createdDate: String!
    createdBy: String
  }

  input CreatePaymentTermInput {
    vendorId: ID!
    companyType: String!
    paymentTermType: String!
    commissionStructure: String
    otherBenefits: Boolean
    benefitDetails: String
    agreementDate: String
    fillAmount: String
  }

  input UpdatePaymentTermInput {
    id: ID!
    paymentTermType: String
    commissionStructure: String
    otherBenefits: Boolean
    benefitDetails: String
    agreementDate: String
    fillAmount: String
    isActive: Boolean
  }

  extend type Query {
    getPaymentTermsByVendor(vendorId: ID!): [PaymentTerm!]!
  }

  extend type Mutation {
    createPaymentTerm(input: CreatePaymentTermInput!): PaymentTerm!
    updatePaymentTerm(input: UpdatePaymentTermInput!): PaymentTerm!
    deletePaymentTerm(id: ID!): Boolean!
  }
`;
