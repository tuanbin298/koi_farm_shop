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
        name
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

// Mutation to create user in admin page
export const MUTATION_USER_ADMIN = gql`
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

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UserUpdateInput!) {
    updateUser(where: { id: $id }, data: $data) {
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

export const DELETE_USERS = gql`
mutation Mutation($where: [UserWhereUniqueInput!]!) {
  deleteUsers(where: $where) {
    id
  }
}`