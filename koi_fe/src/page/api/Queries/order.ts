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
       status
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
        status
      }
    }
  }
}
`

export const GET_ALL_ORDERS = gql`
query Orders {
  orders {
    price
    address
    id
    status
    createAt
    items {
       status
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
      user {
      name
    }
    paymentMethod
  }
}
`