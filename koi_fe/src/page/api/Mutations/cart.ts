import {gql} from "@apollo/client"

// export const CREATE_CART = gql `
// mutation CreateCart($data: CartCreateInput!) {
//   createCart(data: $data) {
//     id
//     createAt
//     itemsCount
//     user {
//       id
//     }
//   }
// }
// `

export const CREATE_CART = gql `
mutation CreateCart($data: CartCreateInput!) {
  createCart(data: $data) {
    id
    user {
      id
    }
    createAt
  }
}
`

export const CREATE_CART_ITEM = gql `
mutation CreateCartItem($data: CartItemCreateInput!) {
  createCartItem(data: $data) {
    id
    price
    cart {
      id
    }
  }
}
`