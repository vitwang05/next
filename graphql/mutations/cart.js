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

export const UPDATE_CART_ITEM = gql`
  mutation UPDATE_CART_ITEM($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: { items: [{ key: $key, quantity: $quantity }] }) {
      updated {
        key
        quantity
      }
      removed {
        key
      }
    }
  }
`;

export const CLEAR_CART = gql`
  mutation CLEAR_CART {
    removeItemsFromCart(input: { all: true }) {
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