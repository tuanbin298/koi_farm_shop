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

export const UPDATE_CART_ITEM = gql`
mutation Mutation($where: CartItemWhereUniqueInput!, $data: CartItemUpdateInput!) {
  updateCartItem(where: $where, data: $data) {
    isStored
  }
}
`
