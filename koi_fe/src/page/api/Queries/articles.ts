import { gql} from "@apollo/client";
// Get all data of product
export const GET_ARTICLES = gql`
query Query ($take: Int){
  articles (take: $take){
    name
    content
    link {
      document
    }
    image {
      publicUrl
    }
  }
}
`;
