import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation ADD_TO_CART($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cart {
        contents {
          nodes {
            key
            quantity
            product {
              node {
                id
                name
                price
              }
            }
          }
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation REMOVE_FROM_CART($key: ID!) {
    removeItemsFromCart(input: { keys: [$key] }) {
      cart {
        contents {
          nodes {
            key
          }
        }
      }
    }
  }
`;
