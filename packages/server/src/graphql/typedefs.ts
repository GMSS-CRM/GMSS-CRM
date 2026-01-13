import { gql } from "graphql-tag";

import { baseTypeDefs } from "./base.schema";
import { userTypeDefs } from "../components/user";
import { roleTypeDefs } from "../components/role";
import { rolePermissionTypeDefs } from "../components/role-permission";

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
];
