import { gql } from "@apollo/client";

// Get all data of category
export const GET_CATEGORY = gql`
  query Categories {
    categories {
      id
      name
      description
    }
  }
`;
