import { gql, useQuery } from "@apollo/client";

// Query để lấy tất cả sản phẩm
export const GET_CONSIGNMENT_SALES = gql`
  query Query($take: Int) {
    consignmentSales(take: $take) {
      id
      name
      sex
      size
      status
      description
      category
      generic
      price
      estimatedPrice
      slug
    }
  }
`;

export const GET_ALL_CONSIGNMENT_SALES = gql`
  query ConsignmentSales {
    consignmentSales {
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
    }
  }
`;
