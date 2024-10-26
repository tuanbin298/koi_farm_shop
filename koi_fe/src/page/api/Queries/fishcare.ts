import { gql } from "@apollo/client";

export const GET_FISH_CARE = gql`
query ConsigmentRaising($where: ConsigmentRaisingWhereUniqueInput!) {
  consigmentRaising(where: $where) {
    id
    user {
      name
    }
    product {
      name
    }
    ConsignmentDate
    ReturnDate
    ConsignmentPrice
    Status
  }
}
`;