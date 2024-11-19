import { gql } from "@apollo/client";

export const MUTATION_CATEGORY = gql`
  mutation CreateCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      name
      description
    }
  }
`;

export const DELETE_CATEGORY = gql`
mutation Mutation($where: [CategoryWhereUniqueInput!]!) {
  deleteCategories(where: $where) {
    id
  }
}
`
