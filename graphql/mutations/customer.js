import { gql } from "@apollo/client";

export const REGISTER_CUSTOMER = gql`
  mutation REGISTER_CUSTOMER($input: RegisterCustomerInput!) {
    registerCustomer(input: $input) {
      customer {
        id
        email
        username
      }
    }
  }
`;

export const LOGIN_CUSTOMER = gql`
  mutation LOGIN_CUSTOMER($input: LoginInput!) {
    login(input: $input) {
      authToken
      user {
        id
        username
        email
      }
    }
  }
`;
