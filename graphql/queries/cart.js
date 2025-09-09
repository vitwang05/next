import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GET_CART {
    cart {
      contents {
        itemCount
        nodes {
          key
          quantity
          subtotal
          total
          product {
            node {
              id
              name
              slug
              type
              image {
                sourceUrl
                altText
              }
              ... on SimpleProduct {
                price
                regularPrice
                salePrice
              }
              ... on VariableProduct {
                price
                regularPrice
                salePrice
                variations {
                  nodes {
                    id
                    name
                    price
                  }
                }
              }
              ... on ExternalProduct {
                price
                externalUrl
              }
            }
          }
        }
      }
      subtotal
      total
    }
  }
`;
