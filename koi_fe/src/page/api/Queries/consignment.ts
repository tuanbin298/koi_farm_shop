import { gql, useQuery } from "@apollo/client";

// Query để lấy tất cả sản phẩm
export const GET_CONSIGNMENT_SALES = gql`
  query ConsignmentSales {
    consignmentSales(where: { status: { equals: "Có sẵn" } }) {
      id
      name
      generic
      description
      medical
      category
      birth
      price
      sex
      size
      status
      slug
      photo {
        id
        image {
          publicUrl
        }
      }
    }
  }
`;

export const GET_ALL_CONSIGNMENT_SALES = gql`
  query ConsignmentSales {
    consignmentSales(where: { status: { equals: "Có sẵn" } }) {
      id
      name
      generic
      description
      medical
      category
      birth
      price
      sex
      size
      status
      slug
      photo {
        id
        image {
          publicUrl
        }
      }
    }
  }
`;
