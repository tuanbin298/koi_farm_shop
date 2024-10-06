import { gql, useQuery} from "@apollo/client";

// Get a limited number of products based on the take argument
export const GET_PRODUCT = gql`
  query GetProducts($take: Int) {
    products(take: $take) {
      id
      name
      birth
      sex
      size
      price
      description
      origin
      generic
      image {
        publicUrl
      }
    }
  }
`;


export const GET_PRODUCT_DETAIL = gql`
query Product($where: ProductWhereUniqueInput!) {
    product(where: $where) {
      id
      name
      birth
      sex
      size
      description
      origin
      generic
      image {
        publicUrl
      }
      price
    }
  }
`

export function useProduct(id) {
  const { loading, error, data } = useQuery(GET_PRODUCT_DETAIL, {
    variables: { where: { id } },
  });

  return {
    loading,
    error,
    product: data?.product,
  };
}


export function useAllProducts() {
  const { loading, error, data } = useQuery(GET_PRODUCT);

  return {
    loading,
    error,
    products: data?.products,
  };
}