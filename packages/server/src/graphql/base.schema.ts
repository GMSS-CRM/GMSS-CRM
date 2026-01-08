import { gql } from 'graphql-tag';

export const baseTypeDefs = gql`
  enum Permission {
    READ_USER
    CREATE_USER
    UPDATE_USER
    DELETE_USER

    READ_ROLE
    CREATE_ROLE
    UPDATE_ROLE
    DELETE_ROLE

    READ_APP_SETTING
    UPDATE_APP_SETTING
  }
`;
