import { gql } from "@apollo/client";

export const GET_PAYMENT_GATEWAYS = gql`
  query GetPaymentGateways {
    paymentGateways {
      nodes {
        id
        title
        description
      }
    }
  }
`;

