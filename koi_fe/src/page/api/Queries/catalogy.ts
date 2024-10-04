import { gql, useQuery } from "@apollo/client";

// Get all data of product
export const GET_CATALOG = gql`
  query Categories {
    categories {
      id
      name
    }
  }
`;
