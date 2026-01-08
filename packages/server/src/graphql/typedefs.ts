import { gql } from "graphql-tag";

import { baseTypeDefs } from "./base.schema";
import { userTypeDefs } from "../components/user/schema";
import { roleTypeDefs } from "../components/role/schema";
import { rolePermissionTypeDefs } from "../components/role-permission/schema";

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
