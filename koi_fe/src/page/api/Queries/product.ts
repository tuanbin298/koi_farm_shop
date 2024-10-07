import { gql, useQuery } from "@apollo/client";

// Query để lấy tất cả sản phẩm
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products {
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

// Query để lấy sản phẩm theo loại
export const GET_PRODUCT_BY_CATEGORY = gql`
  query GetProducts($categoryId: CategoryWhereInput) {
    products(where: { category: $categoryId }) {
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
      category {
        description
        id
        name
      }
    }
  }
`;

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
`;

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
