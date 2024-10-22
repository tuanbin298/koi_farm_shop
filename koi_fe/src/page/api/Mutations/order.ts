import { gql } from "@apollo/client";


export const CREATE_ORDER = gql`
mutation CreateOrder($data: OrderCreateInput!) {
  createOrder(data: $data) {
    id
    user {
      id
    }
    createAt
    price
    status
    address
  }
}
`