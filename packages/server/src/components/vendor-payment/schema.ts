import { gql } from 'graphql-tag';

export const vendorPaymentTypeDefs = gql`
  type PaymentScheduleItem {
    installmentNumber: Int!
    dueDate: String!
    baseAmount: Float!
    gstAmount: Float!
    totalAmount: Float!
  }

  type PaymentScheduleResponse {
    frequency: PaymentFrequency!
    totalInstallments: Int!
    schedule: [PaymentScheduleItem!]!
  }

  extend type Query {
    generateVendorPaymentSchedule(
      totalAmount: Float!
      frequency: PaymentFrequency!
      gstApplicable: Boolean!
      startDate: String!
    ): PaymentScheduleResponse!
  }
`;
