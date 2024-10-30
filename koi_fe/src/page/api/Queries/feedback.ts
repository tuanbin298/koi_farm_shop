import { gql } from "@apollo/client";

//Get feedback with ID
export const GET_FEEDBACK = gql`
  query Query {
    feedbacks {
      user {
        name
      }
      comment
      createdAt
      rating
    }
  }
`;
