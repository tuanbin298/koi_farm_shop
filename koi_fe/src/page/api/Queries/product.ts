import { gql, useQuery } from "@apollo/client";

// Get all data of product
export const GET_PRODUCT = gql`
  query Query {
    products {
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
