import { gql } from "@apollo/client";

export const MUTATION_REGISTER_EMAIL = gql`
  mutation CreateSuccessLoginEmail($to: String!, $userId: String!) {
    createSuccessLoginEmail(to: $to, userId: $userId)
  }
`;
