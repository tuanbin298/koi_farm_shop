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

export const UPDATE_ARTICLE = gql`
  mutation Mutation(
    $where: ArticleWhereUniqueInput!
    $data: ArticleUpdateInput!
  ) {
    updateArticle(where: $where, data: $data) {
      name
      content
      links
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticles($where: [ArticleWhereUniqueInput!]!) {
    deleteArticles(where: $where) {
      id
    }
  }
`;
