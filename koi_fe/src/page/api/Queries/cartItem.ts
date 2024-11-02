import { gql } from "@apollo/client";

export const GET_CART_ITEMS = gql`
  query Query($where: CartItemWhereInput!) {
    cartItems(where: $where) {
      id
      quantity
      product {
        image {
          publicUrl
        }
        name
        price
        id
      }
      consignmentProduct {
        name
        price
        photo {
          image {
            publicUrl
          }
        }
        id
      }
        isStored
    }
  }
`;
