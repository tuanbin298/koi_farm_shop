import { gql } from "@apollo/client";

export const CREATE_CONSIGNMENT_RAISING = gql`
  mutation CreateConsignmentSales($data: [ConsigmentRaisingCreateInput!]!) {
    createConsigmentRaisings(data: $data) {
      id
      user {
        name
      }
      product {
        name
      }
      consignmentDate
      returnDate
      consignmentPrice
      status
      description
    }
  }
`;

export const DELETE_CONSIGNMENT_RAISING = gql`
  mutation DeleteConsigmentRaisings(
    $where: [ConsigmentRaisingWhereUniqueInput!]!
  ) {
    deleteConsigmentRaisings(where: $where) {
      id
    }
  }
`;
