import { gql } from "@apollo/client";

export const UPDATE_PRODUCT = gql`
  mutation Mutation(
    $where: ProductWhereUniqueInput!
    $data: ProductUpdateInput!
  ) {
    updateProduct(where: $where, data: $data) {
      name
      category {
        name
      }
      birth
      description
      origin
      price
      sex
      size
      generic
    }
  }
`;

export const UPDATE_PRODUCT_STATUS = gql`
  mutation UpdateProduct(
    $where: ProductWhereUniqueInput!
    $data: ProductUpdateInput!
  ) {
    updateProduct(where: $where, data: $data) {
      id
      status
    }
  }
`;

export const UPDATE_CONSIGNMENT_PRODUCT_STATUS = gql`
  mutation UpdateConsignmentSale(
    $where: ConsignmentSaleWhereUniqueInput!
    $data: ConsignmentSaleUpdateInput!
  ) {
    updateConsignmentSale(where: $where, data: $data) {
      status
      id
    }
  }
`;

export const UPDATE_CONSIGNMENT_PRODUCT_ADMIN = gql`
  mutation UpdateConsignmentPriceAndRequestStatus(
    $consignmentId: ID!
    $newPrice: Int
    $requestId: ID!
    $newStatus: String
  ) {
    updateConsignmentSale(
      where: { id: $consignmentId }
      data: { price: $newPrice }
    ) {
      id
      name
      price
    }
    updateRequest(where: { id: $requestId }, data: { status: $newStatus }) {
      id
      description
      status
    }
  }
`;
