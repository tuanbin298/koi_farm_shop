import { gql } from "@apollo/client";

export const CONSIGNMENT_SALES_EMAIL = gql`
mutation CreateSuccessConsignmentSaleEmail($to: String!, $consignmentId: String!) {
  createSuccessConsignmentSaleEmail(to: $to, consignmentId: $consignmentId)
}
`