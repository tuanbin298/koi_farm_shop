import { gql, useQuery } from "@apollo/client";

// Query để lấy tất cả sản phẩm
export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(where: { status: { equals: "Có sẵn" } }) {
      id
      name
      birth
      sex
      size
      price
      description
      origin
      generic
      slug
      photo {
        image {
          publicUrl
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCTS_ADMIN = gql`
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
      slug
      photo {
        image {
          publicUrl
        }
      }
      status
      category {
        id
        name
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
      photo {
        image {
          publicUrl
        }
      }
      category {
        description
        id
        name
      }
      slug
    }
  }
`;

export const GET_PRODUCT = gql`
  query Products($take: Int) {
    products(where: { status: { equals: "Có sẵn" } }, take: $take) {
      id
      name
      origin
      price
      size
      sex
      status
      description
      category {
        name
      }
      slug
      photo {
        image {
          publicUrl
        }
      }
      generic
      birth
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
      photo {
        image {
          publicUrl
        }
      }
      price
      slug
    }
  }
`;

export const GET_PRODUCT_DETAIL_BY_SLUG = gql`
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
      photo {
        image {
          publicUrl
        }
      }
      price
      slug
    }
  }
`;

export function useProductBySlug(slug) {
  const { loading, error, data } = useQuery(GET_PRODUCT_DETAIL_BY_SLUG, {
    variables: { where: { slug } }, // Correctly wrap the slug in a where object
  });

  return {
    loading,
    error,
    product: data?.product,
  };
}

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
