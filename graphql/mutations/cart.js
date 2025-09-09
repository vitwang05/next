import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation ($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
        key
        quantity
        product {
          node { id databaseId name }
        }
        variation { node { id databaseId name } }
        total
        subtotal
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
