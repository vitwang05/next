import { gql } from "@apollo/client";

export const CHECKOUT = gql`
  mutation CHECKOUT($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        id
        orderNumber
        status
      }
    }
  }
`;
