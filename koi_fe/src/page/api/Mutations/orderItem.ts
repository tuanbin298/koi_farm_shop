import { gql } from "@apollo/client";

export const CREATE_ORDER_ITEMS = gql`
mutation CreateOrder($data: [OrderItemCreateInput!]!) {
  createOrderItems(data: $data) {
    id
    order {
      id
    }
    product {
      id
    }
    quantity
    price
    consignmentSale {
      id
      name
    }
  }
}

`