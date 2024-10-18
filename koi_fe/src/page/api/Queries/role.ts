import { gql } from "@apollo/client";

// Get role by name
export const GET_ROLE_BY_NAME = gql`
  query Query($where: RoleWhereInput!) {
    roles(where: $where) {
      id
    }
  }
`;
