import { userResolvers } from "../components/user";
import { roleResolvers } from "../components/role";
import { rolePermissionResolvers } from "../components/role-permission";
import { tagResolvers } from "../components/tag";
import { vendorResolvers } from "../components/vendor";
import { vendorTagResolvers } from "../components/vendor-tag";
import { vendorContactPersonResolvers } from "../components/vendor-contact-person";
import { vendorDocumentResolvers } from "../components/vendor-document";
import { paymentTermResolvers } from "../components/payment-term";
import { tenderResolvers } from "../components/tender";
import { tenderDocumentResolvers } from "../components/tender-document";
import { vendorAgreementResolvers } from "../components/vendor-agreement";
import { vendorApprovalResolvers } from "../components/vendor-approval";
import { vendorCommissionResolvers } from "../components/vendor-commission";
import { vendorFollowUpResolvers } from "../components/vendor-followup";
import { vendorPaymentResolvers } from "../components/vendor-payment";
import { vendorProposalResolvers } from "../components/vendor-proposal";
import { vendorTenderResolvers } from "../components/vendor-tender";
import { vendorWorkflowResolvers } from "../components/vendor-workflow";
import { vendorMdRequestResolvers } from "../components/vendor-md-request";
import { uploadResolvers } from "../components/upload";
import { tenderPostAwardResolvers } from "../components/tender-post-award";
import { tenderActivityLogResolvers } from "../components/tender-activity-log";
import { postAwardFollowUpResolvers } from "../components/post-award-follow-up";
import { postAwardDocumentResolvers } from "../components/post-award-document";

export const resolvers = [
  userResolvers,
  roleResolvers,
  rolePermissionResolvers,
  tagResolvers,
  vendorResolvers,
  vendorTagResolvers,
  vendorContactPersonResolvers,
  vendorDocumentResolvers,
  paymentTermResolvers,
  tenderResolvers,
  tenderDocumentResolvers,
  vendorAgreementResolvers,
  vendorApprovalResolvers,
  vendorCommissionResolvers,
  vendorFollowUpResolvers,
  vendorPaymentResolvers,
  vendorProposalResolvers,
  vendorTenderResolvers,
  vendorWorkflowResolvers,
  vendorMdRequestResolvers,
  uploadResolvers,
  tenderPostAwardResolvers,
  tenderActivityLogResolvers,
  postAwardFollowUpResolvers,
  postAwardDocumentResolvers,
];
