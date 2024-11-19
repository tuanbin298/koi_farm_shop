import { gql } from "@apollo/client";

export const CREATE_FEEDBACK = gql`
  mutation Mutation($data: FeedbackCreateInput!) {
    createFeedback(data: $data) {
      user {
        id
      }
      comment
      rating
    }
  }
`;

export const DELETE_FEEDBACK = gql`
  mutation DeleteFeedbacks($where: [FeedbackWhereUniqueInput!]!) {
    deleteFeedbacks(where: $where) {
      id
    }
  }
`;
