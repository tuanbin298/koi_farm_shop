import { gql } from "@apollo/client";

export const MUTATION_ARTICLE = gql`
  mutation CreateArticle(
    $name: String!
    $content: String!
    $links: String!
    $image: Upload!
  ) {
    createArticle(
      data: { name: $name, content: $content, links: $links, image: $image }
    ) {
      id
      name
      content
      links
      image {
        filename
        publicUrl
      }
    }
  }
`;
