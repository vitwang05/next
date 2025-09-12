import { gql } from "@apollo/client";

export const GET_CUSTOMER = gql`
  query GetCustomer {
    customer {
      id
      databaseId
      email
      firstName
      lastName
      username
      displayName
      dateCreated
      billing {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
        email
        phone
      }
      shipping {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($first: Int = 10) {
    customer {
      orders(first: $first) {
        nodes {
          id
          databaseId
          orderNumber
          status
          date
          total
          subtotal
          shippingTotal
          taxTotal
          currency
          paymentMethod
          paymentMethodTitle
          needsPayment
          needsProcessing
          billing {
            firstName
            lastName
            company
            address1
            address2
            city
            state
            postcode
            country
            email
            phone
          }
          shipping {
            firstName
            lastName
            company
            address1
            address2
            city
            state
            postcode
            country
          }
          lineItems {
            nodes {
              id
              productId
              quantity
              subtotal
              total
              product {
                node {
                  id
                  name
                  slug
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
                  }
                  ... on ExternalProduct {
                    price
                    externalUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

