import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $birth: Int!
    $size: Int!
    $description: String!
    $generic: String!
    $category: String!
    $status: String!
    $price: Int!
    $image: Upload!
  ) {
    createProduct(
      data: {
        name: $name
        birth: $birth
        sex: $sex
        size: $size
        description: $description
        generic: $generic
        category: $category
        status: $status
        price: $price
        photo: { create: { image: $image, title: $name } }
      }
    ) {
      id
      name
      birth
      sex
      size
      description
      generic
      category
      status
      price
      photo {
        image {
          filename
          publicUrl
        }
      }
    }
  }
`;
