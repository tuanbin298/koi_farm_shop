import { gql } from "@apollo/client";

// Get all data of category
// export const GET_CART_ITEMS = gql`
//   query Query($where: CartItemWhereInput!) {
//   cartItems(where: $where) {
//     id
//     quantity
//     product {
//       image {
//         publicUrl
//       }
//       name
//       price
//       id
//     }
//   }
// }
// `;


export const GET_CART_ITEMS = gql`
query Query($where: CartItemWhereInput!) {
  cartItems(where: $where) {
    id
    quantity
    product {
      image {
        publicUrl
      }
      name
      price
      id
    }
    consignmentProduct {
      name
      price
      photo {
        image {
          publicUrl
        }
      }
      id
    }
  }
}
`
