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
  query GetProductsShop($first: Int = 12, $after: String, $search: String, $category: String) {
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

export const GET_NEW_ARRIVALS = gql`
  query GetNewArrivals($first: Int = 12) {
    products(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        name
        slug
        description
        onSale
        ... on SimpleProduct { price regularPrice salePrice onSale }
        ... on VariableProduct { price regularPrice salePrice onSale }
        image { sourceUrl }
      }
    }
  }
`;

export const GET_POPULAR_PRODUCTS = gql`
  query GetPopularProducts($first: Int = 12) {
    products(first: $first, where: { orderby: { field: TOTAL_SALES, order: DESC } }) {
      nodes {
        id
        name
        slug
        description
        onSale
        ... on SimpleProduct { price regularPrice salePrice onSale }
        ... on VariableProduct { price regularPrice salePrice onSale }
        image { sourceUrl }
      }
    }
  }
`;