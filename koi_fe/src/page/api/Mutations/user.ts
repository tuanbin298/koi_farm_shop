import { gql } from "@apollo/client";

// Mutation to post data when login
export const MUTATION_LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          name
          email
          phone
          address
          id
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;
//Mutation for update User's profile
export const UPDATE_PROFILE = gql`
mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
  updateUser(where: $where, data: $data) { 
    id
    email
    address
    phone
    name
  }
}
`;