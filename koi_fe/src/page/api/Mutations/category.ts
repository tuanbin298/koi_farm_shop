import { gql } from "@apollo/client";

export const MUTATION_CATEGORY = gql`
  mutation CreateCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      name
      description
    }
  }
`;
