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
