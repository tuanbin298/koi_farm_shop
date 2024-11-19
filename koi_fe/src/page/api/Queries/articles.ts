import { gql } from "@apollo/client";

// Get article
export const GET_ARTICLES = gql`
  query Query($take: Int) {
    articles(take: $take) {
      id
      name
      content
      links
      image {
        publicUrl
      }
    }
  }
`;

// Get article
export const GET_ALL_ARTICLES = gql`
  query Articles {
    articles {
      id
      name
      content
      image {
        publicUrl
      }
    }
  }
`;
