import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
query Query($where: OrderWhereInput!) {
  orders(where: $where) {
    createAt
    address
    price
    status
    id
  }
}
`