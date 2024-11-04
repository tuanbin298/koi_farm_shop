import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
query Orders($where: OrderWhereInput!) {
  orders(where: $where) {
    price
    address
    id
    status
    createAt
    items {
      product {
        name
        price
      }
      consignmentSale {
        name
        price
      }
      consignmentRaising {
        product {
          name
        }
        consignmentDate
        returnDate
        consignmentPrice
      }
    }
  }
}
`