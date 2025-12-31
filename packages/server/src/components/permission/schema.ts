import { gql } from "graphql-tag";

export const permissionTypeDefs = gql`
  enum Permission {
    USER_CREATE
    USER_UPDATE
    USER_DELETE
    USER_VIEW

    ROLE_CREATE
    ROLE_UPDATE
    ROLE_DELETE
    ROLE_VIEW

    APP_SETTING_UPDATE
  }
`;
