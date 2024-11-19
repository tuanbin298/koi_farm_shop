import { gql } from "@apollo/client";

export const MUTATION_CATEGORY = gql`
  mutation CreateCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      name
      description
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory(
    $where: CategoryWhereUniqueInput!
    $data: CategoryUpdateInput!
  ) {
    updateCategory(where: $where, data: $data) {
      name
      description
      id
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategories($where: [CategoryWhereUniqueInput!]!) {
    deleteCategories(where: $where) {
      id
    }
  }
`;
