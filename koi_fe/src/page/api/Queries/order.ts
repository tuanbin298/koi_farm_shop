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
`;

export const GET_ORDER_ITEMS_BY_ORDER_ID = gql`
  query Order($where: OrderWhereUniqueInput!) {
    order(where: $where) {
      items {
        id
      }
    }
  }
`;
