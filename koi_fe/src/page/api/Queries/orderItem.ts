import { gql } from "@apollo/client";

export const GET_ORDER_ITEM_ID = gql`
query Query($where: OrderItemWhereInput!) {
  orderItems(where: $where) {
    id
  }
}
`