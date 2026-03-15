import { gql } from 'graphql-tag';

export const tenderPostAwardTypeDefs = gql`
  enum PostAwardStage {
    ORDER_FOLLOWUP
    ORDER_PROCESSING
    INSPECTION
    DISPATCH_DELIVERY
    WARRANTY
    BILL_PAYMENT
    CLOSED
  }

  type TenderPostAward {
    id: ID!
    tenderId: ID!
    currentStage: PostAwardStage!

    # Stage 1 – Order Follow-Up
    tenderOfficerName: String
    tenderOfficerPhone: String
    tenderOfficerEmail: String
    followUpRemarks: String
    loaReceived: Boolean!
    poNumber: String
    poDate: String
    emdReturnReceived: Boolean!
    emdAmount: Float
    emdAdviceNumber: String
    emdReceivedDate: String

    # Stage 2 – Order Processing
    poUploaded: Boolean!
    poDocumentUrl: String
    commissionPaymentRequired: Boolean!
    securityDepositRequired: Boolean!
    securityDepositType: String
    securityDepositAmount: Float
    securityDepositDueDate: String
    sdCourierDetails: String
    sdDocumentUrl: String
    deliveryDeadlineDays: Int
    poReleasedToVendor: Boolean!
    poReleasedDate: String
    extensionRequested: Boolean!
    extensionReason: String
    newDeliveryDate: String
    extensionAccepted: Boolean!
    moaDocumentUrl: String
    ldcApplicable: Boolean!
    ldcPercentage: Float
    lateDeliveryBy: String

    # Stage 3 – Inspection
    inspectionRequired: Boolean!
    tpiAgencyName: String
    tpiOfficerName: String
    tpiOfficerContact: String
    tpiVisitSchedule: String
    inspectionDone: Boolean!
    inspectionCertificateUrl: String

    # Stage 4 – Dispatch & Delivery
    purchaseInvoiceReceived: Boolean!
    courierCompanyName: String
    courierContact: String
    podNumber: String
    consignmentNumber: String
    actualDeliveryDate: String
    proofOfDeliveryUrl: String
    ldcGivenPercentage: Float
    ldcRailwayPoValue: Float
    ldcCalculatedTotal: Float
    ldcInvoiceUrl: String
    receiptNoteReceived: Boolean!
    receiptNoteDetails: String

    # Stage 5 – Warranty Rejections
    warrantyRejectionApplicable: Boolean!
    warrantyRejectionReason: String
    warrantyAdviceNumber: String
    warrantyPoNumber: String
    warrantyPoDate: String
    warrantyInvoiceNumber: String
    warrantyInvoiceDate: String
    warrantyCompanyName: String
    warrantyConsigneeName: String
    warrantyConsigneeNumber: String
    warrantyPeriod: String
    warrantyEngineerVisit: Boolean!
    warrantyEngineerName: String
    warrantyEngineerContact: String
    warrantyEngineerVisitDate: String
    warrantyJointReportUrl: String
    warrantyAction: String
    warrantyWithin60Days: Boolean!
    runningBillDeduction: Boolean!
    warrantyRejectionWithdrawalUrl: String
    warrantyRecoveryRefundUrl: String
    warrantySupplementaryInvoiceUrl: String

    # Stage 6 – Bill Submission & Payments
    billUploaded: Boolean!
    paymentDepartmentName: String
    paymentOfficerName: String
    paymentOfficerContact: String
    paymentStatus: String
    paymentRemarks: String
    deductionReason: String
    debitNoteProvided: Boolean!
    commissionInvoiceProvided: Boolean!
    sdReleased: Boolean!
    sdReleaseDepartmentDetails: String

    createdDate: String!
    updatedDate: String!
  }

  input UpdateOrderFollowUpInput {
    tenderId: ID!
    tenderOfficerName: String
    tenderOfficerPhone: String
    tenderOfficerEmail: String
    followUpRemarks: String
    loaReceived: Boolean
    poNumber: String
    poDate: String
    emdReturnReceived: Boolean
    emdAmount: Float
    emdAdviceNumber: String
    emdReceivedDate: String
  }

  input UpdateOrderProcessingInput {
    tenderId: ID!
    poUploaded: Boolean
    poDocumentUrl: String
    commissionPaymentRequired: Boolean
    securityDepositRequired: Boolean
    securityDepositType: String
    securityDepositAmount: Float
    securityDepositDueDate: String
    sdCourierDetails: String
    sdDocumentUrl: String
    deliveryDeadlineDays: Int
    poReleasedToVendor: Boolean
    poReleasedDate: String
    extensionRequested: Boolean
    extensionReason: String
    newDeliveryDate: String
    extensionAccepted: Boolean
    moaDocumentUrl: String
    ldcApplicable: Boolean
    ldcPercentage: Float
    lateDeliveryBy: String
  }

  input UpdateInspectionInput {
    tenderId: ID!
    inspectionRequired: Boolean
    tpiAgencyName: String
    tpiOfficerName: String
    tpiOfficerContact: String
    tpiVisitSchedule: String
    inspectionDone: Boolean
    inspectionCertificateUrl: String
  }

  input UpdateDispatchDeliveryInput {
    tenderId: ID!
    purchaseInvoiceReceived: Boolean
    courierCompanyName: String
    courierContact: String
    podNumber: String
    consignmentNumber: String
    actualDeliveryDate: String
    proofOfDeliveryUrl: String
    ldcGivenPercentage: Float
    ldcRailwayPoValue: Float
    ldcCalculatedTotal: Float
    ldcInvoiceUrl: String
    receiptNoteReceived: Boolean
    receiptNoteDetails: String
  }

  input UpdateWarrantyInput {
    tenderId: ID!
    warrantyRejectionApplicable: Boolean
    warrantyRejectionReason: String
    warrantyAdviceNumber: String
    warrantyPoNumber: String
    warrantyPoDate: String
    warrantyInvoiceNumber: String
    warrantyInvoiceDate: String
    warrantyCompanyName: String
    warrantyConsigneeName: String
    warrantyConsigneeNumber: String
    warrantyPeriod: String
    warrantyEngineerVisit: Boolean
    warrantyEngineerName: String
    warrantyEngineerContact: String
    warrantyEngineerVisitDate: String
    warrantyJointReportUrl: String
    warrantyAction: String
    warrantyWithin60Days: Boolean
    runningBillDeduction: Boolean
    warrantyRejectionWithdrawalUrl: String
    warrantyRecoveryRefundUrl: String
    warrantySupplementaryInvoiceUrl: String
  }

  input UpdateBillPaymentInput {
    tenderId: ID!
    billUploaded: Boolean
    paymentDepartmentName: String
    paymentOfficerName: String
    paymentOfficerContact: String
    paymentStatus: String
    paymentRemarks: String
    deductionReason: String
    debitNoteProvided: Boolean
    commissionInvoiceProvided: Boolean
    sdReleased: Boolean
    sdReleaseDepartmentDetails: String
  }

  extend type Query {
    getTenderPostAward(tenderId: ID!): TenderPostAward!
  }

  extend type Mutation {
    updateOrderFollowUp(input: UpdateOrderFollowUpInput!): TenderPostAward!
    updateOrderProcessing(input: UpdateOrderProcessingInput!): TenderPostAward!
    updateInspection(input: UpdateInspectionInput!): TenderPostAward!
    updateDispatchDelivery(input: UpdateDispatchDeliveryInput!): TenderPostAward!
    updateWarranty(input: UpdateWarrantyInput!): TenderPostAward!
    updateBillPayment(input: UpdateBillPaymentInput!): TenderPostAward!
    advancePostAwardStage(tenderId: ID!): TenderPostAward!
  }
`;
