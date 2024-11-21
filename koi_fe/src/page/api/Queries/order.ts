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
        }
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query Orders {
    orders {
      price
      address
      id
      status
      createAt
      items {
      id
        status
        product {
          id
          name
          price
        }
        consignmentSale {
          id
          name
          price
        }
        consignmentRaising {
          product {
            id
            name
          }
          consignmentDate
          returnDate
          consignmentPrice
          id
        }
      }
      user {
        name
      }
      paymentMethod
    }
  }
`;
