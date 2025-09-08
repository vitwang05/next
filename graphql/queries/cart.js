import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GET_CART {
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
      total
    }
  }
`;
