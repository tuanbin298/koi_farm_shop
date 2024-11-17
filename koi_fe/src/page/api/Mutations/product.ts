import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $birth: Int!
    $sex: String!
    $size: String!
    $description: String!
    $generic: String!
    $origin: String!
    $category: CategoryRelateToOneForCreateInput!
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
        origin: $origin
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
      origin
      category {
        id
        name
      }
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
