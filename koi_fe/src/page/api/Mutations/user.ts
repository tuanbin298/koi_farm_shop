import { gql } from "@apollo/client";

// Mutation to post data when login
export const MUTATION_LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          name
          email
          phone
          address
          role {
            name
          }
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

// Mutation to create user
export const REGISTER_MUTATION = gql`
  mutation Mutation($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      name
      email
      password {
        isSet
      }
      phone
      address
      role {
        id
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
