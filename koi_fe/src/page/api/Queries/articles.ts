import { gql} from "@apollo/client";
// Get all data of product
export const GET_ARTICLES = gql`
query Query {
  articles {
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
