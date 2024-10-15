import { gql } from "@apollo/client";

export const DELETE_CART_ITEM = gql`
mutation Mutation($where: CartItemWhereUniqueInput!) {
  deleteCartItem(where: $where) {
    id
  }
}
`;
