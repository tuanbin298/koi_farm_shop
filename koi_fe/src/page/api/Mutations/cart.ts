import { gql } from "@apollo/client";

export const CREATE_CART_ITEM = gql`
  mutation CreateCartItem($data: CartItemCreateInput!) {
    createCartItem(data: $data) {
      id
      product {
        id
      }
      consignmentProduct {
        id
        name
        price
      }
    }
  }
`;
