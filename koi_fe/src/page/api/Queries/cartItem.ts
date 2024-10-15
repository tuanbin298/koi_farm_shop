import { gql } from "@apollo/client";

// Get all data of category
export const GET_CART_ITEMS = gql`
  query Query($where: CartItemWhereInput!) {
  cartItems(where: $where) {
    id
    product {
      image {
        publicUrl
      }
      name
      price
    }
  }
}
`;
