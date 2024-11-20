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
      price
      consignmentSale {
        id
        name
      }
      isStored
    }
  }
`;

export const UPDATE_ORDER_ITEM = gql`
  mutation UpdateOrderItem(
    $where: OrderItemWhereUniqueInput!
    $data: OrderItemUpdateInput!
  ) {
    updateOrderItem(where: $where, data: $data) {
      consignmentRaising {
        id
      }
    }
  }
`;

export const UPDATE_ORDER_ITEM_ADMIN = gql`
  mutation UpdateOrderItem(
    $where: OrderItemWhereUniqueInput!
    $data: OrderItemUpdateInput!
  ) {
    updateOrderItem(where: $where, data: $data) {
      consignmentRaising {
        id
        status
      }
    }
  }
`;