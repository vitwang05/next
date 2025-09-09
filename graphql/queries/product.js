import { gql } from "@apollo/client";

export const GET_PRODUCT = gql`
  query Product($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      averageRating
      slug
      description
      onSale
      image {
        id
        uri
        title
        srcSet
        sourceUrl
      }
      name

      ... on SimpleProduct {
        salePrice
        regularPrice
        price
        id
        stockQuantity
      }

      ... on VariableProduct {
        salePrice
        regularPrice
        price
        id
        allPaColor {
          nodes {
            name
          }
        }
        allPaSize {
          nodes {
            name
          }
        }
        variations(first: 50) {   # 👈 thêm first: 50 (hoặc hơn nếu nhiều)
          nodes {
            id
            databaseId
            name
            stockStatus
            stockQuantity
            purchasable
            onSale
            salePrice
            regularPrice
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }

      ... on ExternalProduct {
        price
        id
        externalUrl
      }

      ... on GroupProduct {
        products {
          nodes {
            ... on SimpleProduct {
              id
              price
            }
          }
        }
        id
      }
    }
  }
`;
