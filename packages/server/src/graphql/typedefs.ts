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
import { tenderTypeDefs } from "../components/tender";
import { tenderDocumentTypeDefs } from "../components/tender-document";

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
  tenderTypeDefs,
  tenderDocumentTypeDefs,
];
