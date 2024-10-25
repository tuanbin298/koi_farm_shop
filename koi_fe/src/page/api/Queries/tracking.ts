import { gql } from "@apollo/client";

export const GET_TRACKING_REQUEST = gql`
  query Requests($userId: ID) {
    requests(where: { user: { id: { equals: $userId } } }) {
      id
      status
      consignment {
        id
        name
        estimatedPrice
        price
        status
      }
      user {
        id
      }
      createAt
      statusHistory {
        status
      }
    }
  }
`;
