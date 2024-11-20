import { gql } from "@apollo/client";

//Get feedback with ID
export const GET_FEEDBACK = gql`
  query Query {
    feedbacks {
      id
      user {
        name
      }
      comment
      createdAt
      rating
    }
  }
`;
