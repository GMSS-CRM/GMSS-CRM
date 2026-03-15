import { gql } from "graphql-tag";

import { baseTypeDefs } from "./base.schema";
import { userTypeDefs } from "../components/user";
import { roleTypeDefs } from "../components/role";
import { rolePermissionTypeDefs } from "../components/role-permission";
import { tagTypeDefs } from "../components/tag";
import { vendorTypeDefs } from "../components/vendor";
import { vendorTagTypeDefs } from "../components/vendor-tag";
import { vendorContactPersonTypeDefs } from "../components/vendor-contact-person";
import { vendorDocumentTypeDefs } from "../components/vendor-document";
import { paymentTermTypeDefs } from "../components/payment-term";
import { tenderTypeDefs } from "../components/tender";
import { tenderDocumentTypeDefs } from "../components/tender-document";
import { vendorAgreementTypeDefs } from "../components/vendor-agreement";
import { vendorApprovalTypeDefs } from "../components/vendor-approval";
import { vendorCommissionTypeDefs } from "../components/vendor-commission";
import { vendorFollowUpTypeDefs } from "../components/vendor-followup";
import { vendorPaymentTypeDefs } from "../components/vendor-payment";
import { vendorProposalTypeDefs } from "../components/vendor-proposal";
import { vendorTenderTypeDefs } from "../components/vendor-tender";
import { vendorWorkflowTypeDefs } from "../components/vendor-workflow";
import { vendorMdRequestTypeDefs } from "../components/vendor-md-request";
import { uploadTypeDefs } from "../components/upload";
import { tenderPostAwardTypeDefs } from "../components/tender-post-award";
import { tenderActivityLogTypeDefs } from "../components/tender-activity-log";
import { postAwardFollowUpTypeDefs } from "../components/post-award-follow-up";
import { postAwardDocumentTypeDefs } from "../components/post-award-document";

export const typeDefs = gql`
  scalar DateTime

  type Query
  type Mutation
`;

export const mergedTypeDefs = [
  typeDefs,
  baseTypeDefs,
  userTypeDefs,
  roleTypeDefs,
  rolePermissionTypeDefs,
  tagTypeDefs,
  vendorTypeDefs,
  vendorTagTypeDefs,
  vendorContactPersonTypeDefs,
  vendorDocumentTypeDefs,
  paymentTermTypeDefs,
  tenderTypeDefs,
  tenderDocumentTypeDefs,
  vendorAgreementTypeDefs,
  vendorApprovalTypeDefs,
  vendorCommissionTypeDefs,
  vendorFollowUpTypeDefs,
  vendorPaymentTypeDefs,
  vendorProposalTypeDefs,
  vendorTenderTypeDefs,
  vendorWorkflowTypeDefs,
  vendorMdRequestTypeDefs,
  uploadTypeDefs,
  tenderPostAwardTypeDefs,
  tenderActivityLogTypeDefs,
  postAwardFollowUpTypeDefs,
  postAwardDocumentTypeDefs,
];
