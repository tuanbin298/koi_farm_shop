import { gql, useState } from "@apollo/client";

// Get a limited number of products based on the take argument
export const GET_PRODUCT = gql`
  query GetProducts($take: Int) {
    products(take: $take) {
      id
      name
      birth
      sex
      size
      price
      description
      origin
      generic
      image {
        publicUrl
      }
    }
  }
`;


