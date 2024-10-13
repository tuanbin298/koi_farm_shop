import { gql } from "@apollo/client";

// Mutation để tạo một request mới
export const CREATE_REQUEST = gql`
  mutation CreateRequest(
    $userId: ID!
    $description: String!
    $status: String!
  ) {
    createRequest(
      data: {
        user: { connect: { id: $userId } }
        description: $description
        status: $status
      }
    ) {
      id
      description
      status
    }
  }
`;

// Mutation để thêm chi tiết cá Koi vào bảng ConsignmentSale
export const CREATE_CONSIGNMENT_SALE = gql`
  mutation CreateConsignmentSale(
    $name: String!
    $birth: Int!
    $size: Int!
    $price: Int!
    $description: String
    $origin: String!
    $generic: String!
    $image: Upload
    $status: String!
  ) {
    createConsignmentSale(
      data: {
        name: $name
        birth: $birth
        size: $size
        price: $price
        description: $description
        origin: $origin
        generic: $generic
        image: $image
        status: $status
      }
    ) {
      id
    }
  }
`;
