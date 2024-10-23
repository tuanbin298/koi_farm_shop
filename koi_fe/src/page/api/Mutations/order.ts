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
    items {
      id
    }
  }
}
`

export const UPDATE_ORDER = gql`
mutation UpdateOrder($where: OrderWhereUniqueInput!, $data: OrderUpdateInput!) {
  updateOrder(where: $where, data: $data) {
    items {
      id
    }
  }
}
`