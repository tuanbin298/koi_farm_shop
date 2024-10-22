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
      origin
      description
      category
      generic
      price
      estimatedPrice
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
      origin
      price
      sex
      size
      status
    }
  }
`;
