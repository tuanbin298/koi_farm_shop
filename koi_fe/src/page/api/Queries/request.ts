import { gql } from "@apollo/client";


export const GET_REQUEST = gql`
query Query($where: RequestWhereInput!) {
  requests(where: $where) {
    id
    user {
      email
    }
  }
}
`