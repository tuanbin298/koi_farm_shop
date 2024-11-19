import { gql } from "@apollo/client";

//query to get User
export const GET_PROFILE = gql`
  query Query($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      email
      address
      phone
      name
      role {
        name
      }
    }
  }
`;

export const GET_PROFILE_ADMIN = gql`
  query Users {
    users {
      id
      name
      email
      address
      phone
      role {
        id
        name
      }
    }
  }
`;
