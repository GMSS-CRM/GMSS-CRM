import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import type { TenderPostAward } from '@gmss/types';

// ─── Fragments ────────────────────────────────────────────────────────────────

const TENDER_POST_AWARD_FIELDS = gql`
  fragment TenderPostAwardFields on TenderPostAward {
    id
    tenderId
    currentStage

    # Stage 1 – Order Follow-Up
    tenderOfficerName
    tenderOfficerPhone
    tenderOfficerEmail
    followUpRemarks
    loaReceived
    poNumber
    poDate
    emdReturnReceived
    emdAmount
    emdAdviceNumber
    emdReceivedDate

    # Stage 2 – Order Processing
    poUploaded
    poDocumentUrl
    commissionPaymentRequired
    securityDepositRequired
    securityDepositType
    securityDepositAmount
    securityDepositDueDate
    sdCourierDetails
    sdDocumentUrl
    deliveryDeadlineDays
    poReleasedToVendor
    poReleasedDate
    extensionRequested
    extensionReason
    newDeliveryDate
    extensionAccepted
    moaDocumentUrl
    ldcApplicable
    ldcPercentage
    lateDeliveryBy

    # Stage 3 – Inspection
    inspectionRequired
    tpiAgencyName
    tpiOfficerName
    tpiOfficerContact
    tpiVisitSchedule
    inspectionDone
    inspectionCertificateUrl

    # Stage 4 – Dispatch & Delivery
    purchaseInvoiceReceived
    courierCompanyName
    courierContact
    podNumber
    consignmentNumber
    actualDeliveryDate
    proofOfDeliveryUrl
    ldcGivenPercentage
    ldcRailwayPoValue
    ldcCalculatedTotal
    ldcInvoiceUrl
    receiptNoteReceived
    receiptNoteDetails

    # Stage 5 – Warranty Rejections
    warrantyRejectionApplicable
    warrantyRejectionReason
    warrantyAdviceNumber
    warrantyPoNumber
    warrantyPoDate
    warrantyInvoiceNumber
    warrantyInvoiceDate
    warrantyCompanyName
    warrantyConsigneeName
    warrantyConsigneeNumber
    warrantyPeriod
    warrantyEngineerVisit
    warrantyEngineerName
    warrantyEngineerContact
    warrantyEngineerVisitDate
    warrantyJointReportUrl
    warrantyAction
    warrantyWithin60Days
    runningBillDeduction
    warrantyRejectionWithdrawalUrl
    warrantyRecoveryRefundUrl
    warrantySupplementaryInvoiceUrl

    # Stage 6 – Bill Submission & Payments
    billUploaded
    paymentDepartmentName
    paymentOfficerName
    paymentOfficerContact
    paymentStatus
    paymentRemarks
    deductionReason
    debitNoteProvided
    commissionInvoiceProvided
    sdReleased
    sdReleaseDepartmentDetails

    createdDate
    updatedDate
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_TENDER_POST_AWARD = gql`
  ${TENDER_POST_AWARD_FIELDS}
  query GetTenderPostAward($tenderId: ID!) {
    getTenderPostAward(tenderId: $tenderId) {
      ...TenderPostAwardFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const UPDATE_ORDER_FOLLOW_UP = gql`
  ${TENDER_POST_AWARD_FIELDS}
  mutation UpdateOrderFollowUp($input: UpdateOrderFollowUpInput!) {
    updateOrderFollowUp(input: $input) {
      ...TenderPostAwardFields
    }
  }
`;

export const UPDATE_ORDER_PROCESSING = gql`
  ${TENDER_POST_AWARD_FIELDS}
  mutation UpdateOrderProcessing($input: UpdateOrderProcessingInput!) {
    updateOrderProcessing(input: $input) {
      ...TenderPostAwardFields
    }
  }
`;

export const UPDATE_INSPECTION = gql`
  ${TENDER_POST_AWARD_FIELDS}
  mutation UpdateInspection($input: UpdateInspectionInput!) {
    updateInspection(input: $input) {
      ...TenderPostAwardFields
    }
  }
`;

export const UPDATE_DISPATCH_DELIVERY = gql`
  ${TENDER_POST_AWARD_FIELDS}
  mutation UpdateDispatchDelivery($input: UpdateDispatchDeliveryInput!) {
    updateDispatchDelivery(input: $input) {
      ...TenderPostAwardFields
    }
  }
`;

export const UPDATE_WARRANTY = gql`
  ${TENDER_POST_AWARD_FIELDS}
  mutation UpdateWarranty($input: UpdateWarrantyInput!) {
    updateWarranty(input: $input) {
      ...TenderPostAwardFields
    }
  }
`;

export const UPDATE_BILL_PAYMENT = gql`
  ${TENDER_POST_AWARD_FIELDS}
  mutation UpdateBillPayment($input: UpdateBillPaymentInput!) {
    updateBillPayment(input: $input) {
      ...TenderPostAwardFields
    }
  }
`;

export const ADVANCE_POST_AWARD_STAGE = gql`
  ${TENDER_POST_AWARD_FIELDS}
  mutation AdvancePostAwardStage($tenderId: ID!) {
    advancePostAwardStage(tenderId: $tenderId) {
      ...TenderPostAwardFields
    }
  }
`;

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetTenderPostAward = (tenderId: string) =>
  useQuery<{ getTenderPostAward: TenderPostAward }>(GET_TENDER_POST_AWARD, {
    variables: { tenderId },
    skip: !tenderId,
  });

export const useUpdateOrderFollowUp = () =>
  useMutation(UPDATE_ORDER_FOLLOW_UP, {
    refetchQueries: [GET_TENDER_POST_AWARD],
  });

export const useUpdateOrderProcessing = () =>
  useMutation(UPDATE_ORDER_PROCESSING, {
    refetchQueries: [GET_TENDER_POST_AWARD],
  });

export const useUpdateInspection = () =>
  useMutation(UPDATE_INSPECTION, {
    refetchQueries: [GET_TENDER_POST_AWARD],
  });

export const useUpdateDispatchDelivery = () =>
  useMutation(UPDATE_DISPATCH_DELIVERY, {
    refetchQueries: [GET_TENDER_POST_AWARD],
  });

export const useUpdateWarranty = () =>
  useMutation(UPDATE_WARRANTY, {
    refetchQueries: [GET_TENDER_POST_AWARD],
  });

export const useUpdateBillPayment = () =>
  useMutation(UPDATE_BILL_PAYMENT, {
    refetchQueries: [GET_TENDER_POST_AWARD],
  });

export const useAdvancePostAwardStage = () =>
  useMutation(ADVANCE_POST_AWARD_STAGE, {
    refetchQueries: [GET_TENDER_POST_AWARD],
  });
