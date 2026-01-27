import { userResolvers } from "../components/user";
import { roleResolvers } from "../components/role";
import { rolePermissionResolvers } from "../components/role-permission";
import { tagResolvers } from "../components/tag";
import { vendorResolvers } from "../components/vendor";
import { vendorContactPersonResolvers } from "../components/vendor-contact-person";
import { vendorDocumentResolvers } from "../components/vendor-document";
import { tenderResolvers } from "../components/tender";
import { tenderDocumentResolvers } from "../components/tender-document";

export const resolvers = [
  userResolvers,
  roleResolvers,
  rolePermissionResolvers,
  tagResolvers,
  vendorResolvers,
  vendorContactPersonResolvers,
  vendorDocumentResolvers,
  tenderResolvers,
  tenderDocumentResolvers,
];
