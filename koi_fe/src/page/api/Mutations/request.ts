import { gql } from "@apollo/client";

// Mutation để tạo một request mới
export const CREATE_REQUEST = gql`
  mutation CreateRequest($data: RequestCreateInput!) {
    createRequest(data: $data) {
      consignment {
        id
      }
      description
      status
      user {
        id
      }
    }
  }
`;

// Mutation để thêm chi tiết cá Koi vào bảng ConsignmentSale
export const CREATE_CONSIGNMENT_SALE = gql`
  mutation CreateConsignmentSale($data: ConsignmentSaleCreateInput!) {
    createConsignmentSale(data: $data) {
      id
      name
      sex
      birth
      size
      status
      generic
      description
      category
      origin
      medical
    }
  }
`;
