import { gql } from "@apollo/client";

// Get role by name
export const GET_ROLE_BY_NAME = gql`
  query Query($where: RoleWhereInput!) {
    roles(where: $where) {
      id
    }
  }
`;

// Get all role
export const GET_ALL_ROLE = gql`
  query Roles {
    roles {
      id
      name
    }
  }
`;
