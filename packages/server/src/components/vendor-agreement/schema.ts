import { gql } from 'graphql-tag';

export const vendorAgreementTypeDefs = gql`
type VendorAgreement {
  id: ID!
  vendorId: ID!

  agreementStartDate: String!
  agreementEndDate: String!
  renewalReminderDate: String

  signatureStatus: SignatureStatus!
  signedDate: String

  commissionType: CommissionType
  commissionValue: Float
  commissionStructure: CommissionStructure

  paymentFrequency: PaymentFrequency
  paymentAmount: Float
  gstApplicable: Boolean!

  hasOtherBenefits: Boolean!
  otherBenefitsDescription: String

  createdDate: String!
  updatedDate: String!
}

input CreateAgreementInput {
  vendorId: ID!
  agreementStartDate: String!
  agreementEndDate: String!
  commissionType: CommissionType
  commissionValue: Float
  commissionStructure: CommissionStructure
  paymentFrequency: PaymentFrequency
  paymentAmount: Float
  gstApplicable: Boolean
  hasOtherBenefits: Boolean
  otherBenefitsDescription: String
}

input UpdateSignatureInput {
  agreementId: ID!
  signatureStatus: SignatureStatus!
  signedDate: String
}

extend type Query {
  getVendorAgreements(vendorId: ID!): [VendorAgreement!]!
}

extend type Mutation {
  createVendorAgreement(input: CreateAgreementInput!): VendorAgreement!
  updateAgreementSignature(input: UpdateSignatureInput!): VendorAgreement!
}
`;
