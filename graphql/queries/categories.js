import { gql } from "@apollo/client";

// Try to get brands via attribute `pa_brand` (common Woo setup). Fallback to product categories.
export const GET_CATEGORIES = gql`
  query GetCategories {
    productCategories(first: 20) {
      nodes {
        id
        name
        slug
        description
        count
        image {
          sourceUrl
        }
      }
    }
  }
`;


