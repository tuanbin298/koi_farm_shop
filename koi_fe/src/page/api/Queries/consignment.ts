import { gql, useQuery } from "@apollo/client";

// Query để lấy tất cả sản phẩm
export const GET_CONSIGNMENT_SALES = gql`
  query ConsignmentSales {
    consignmentSales(where: { status: { equals: "Có sẵn" } }) {
      id
      name
      generic
      description
      medical
      category
      birth
      price
      sex
      size
      status
      slug
      photo {
        id
        image {
          publicUrl
        }
      }
    }
  }
`;

export const GET_ALL_CONSIGNMENT_SALES = gql`
  query ConsignmentSales {
    consignmentSales(where: { status: { equals: "Có sẵn" } }) {
      id
      name
      generic
      description
      medical
      category
      birth
      price
      sex
      size
      status
      slug
      photo {
        id
        image {
          publicUrl
        }
      }
    }
  }
`;



export const GET_CONSIGNMENT_SALES_BY_SLUG = gql`
query ConsignmentSales($where: ConsignmentSaleWhereInput!) {
    consignmentSales(where: $where){
      id
      name
      generic
      description
      medical
      category
      birth
      price
      sex
      size
      status
      slug
      photo {
        id
        image {
          publicUrl
        }
      }
    }
  }
`


export const useConsignmentBySlug = (slug) => {
  const { loading, error, data } = useQuery(GET_CONSIGNMENT_SALES_BY_SLUG, {
    variables: {
      where: { slug: { equals: slug } },
    },
  });
  return {
    loading,
    error,
    product: data?.consignmentSales[0], // Assuming only one product matches the slug
  };
};
