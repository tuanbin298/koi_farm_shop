import { gql } from "@apollo/client";

//Get feedback with ID
export const GET_PRODUCT_FEEDBACK = gql`
  query Query($productId: ID!) {
    feedbacks(where: { product: { id: { equals: $productId } } }) {
      id
      comment
      createdAt
    }
  }
`;
