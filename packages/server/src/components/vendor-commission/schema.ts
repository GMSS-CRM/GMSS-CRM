import { gql } from 'graphql-tag';

export const vendorCommissionTypeDefs = gql`
  type CommissionBreakdown {
    baseAmount: Float!
    commissionAmount: Float!
    gstAmount: Float!
    totalAmount: Float!
  }

  extend type Query {
    calculateVendorCommission(
      baseAmount: Float!
      commissionType: CommissionType!
      commissionValue: Float!
      gstApplicable: Boolean!
    ): CommissionBreakdown!
  }
`;
