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

// // Mutation để thêm chi tiết cá Koi vào bảng ConsignmentSale
export const CREATE_CONSIGNMENT_SALE = gql`
  mutation CreateConsignmentSale(
    $name: String!
    $birth: Int!
    $sex: String!
    $medical: String!
    $size: Int!
    $description: String!
    $generic: String!
    $image: Upload!
    $category: String!
    $estimatedPrice: String!
    $status: String!
  ) {
    createConsignmentSale(
      data: {
        name: $name
        birth: $birth
        sex: $sex
        medical: $medical
        size: $size
        description: $description
        generic: $generic
        photo: { create: { image: $image, title: $name } }
        category: $category
        estimatedPrice: $estimatedPrice
        status: $status
      }
    ) {
      id
      name
      birth
      sex
      medical
      size
      description
      generic
      photo {
        image {
          filename
          publicUrl
        }
      }
      category
      estimatedPrice
      status
    }
  }
`;
