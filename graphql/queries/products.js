import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 10) {
      nodes {
        id
        name
        slug
        description
        onSale
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          onSale
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          onSale
        }
        image {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_PRODUCTS_WITH_FILTERS = gql`
  query GetProductsShop($first: Int = 24, $after: String, $search: String, $category: String) {
    products(first: $first, after: $after, where: { search: $search, category: $category }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        name
        slug
        description
        onSale
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          onSale
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          onSale
        }
        image {
          sourceUrl
        }
      }
    }
  }
`;