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

export const GET_ALL_FISH_CARE = gql`
  query ConsigmentRaisings($where: ConsigmentRaisingWhereInput!) {
    consigmentRaisings(where: $where) {
      id
      user {
        id
        name
      }
      product {
        id
        name
      }
      consignmentDate
      returnDate
      consignmentPrice
      status
    }
  }
`;

export const GET_ALL_FISH_CARE_ADMIN = gql`
  query ConsigmentRaisings {
    consigmentRaisings {
      product {
        name
        birth
        category {
          name
        }
        description
        generic
        photo {
          image {
            publicUrl
          }
        }
        origin
        price
        sex
        size
        status
      }
      description
      consignmentPrice
      consignmentDate
      returnDate
      user {
        name
        email
        address
        phone
      }
    }
  }
`;
