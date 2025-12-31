import { gql } from "graphql-tag";

import { userTypeDefs } from "../components/user/schema";
import { roleTypeDefs } from "../components/role/schema";
import { permissionTypeDefs } from "../components/permission/schema";
import { appSettingTypeDefs } from "../components/app-setting/schema";

export const typeDefs = gql`
  scalar DateTime

  type Query
  type Mutation
`;

export const mergedTypeDefs = [
  typeDefs,
  userTypeDefs,
  roleTypeDefs,
  permissionTypeDefs,
  appSettingTypeDefs,
];
