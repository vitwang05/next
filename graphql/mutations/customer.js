import { gql } from "@apollo/client";

export const REGISTER_CUSTOMER = gql`
  mutation REGISTER_CUSTOMER($input: RegisterCustomerInput!) {
    registerCustomer(input: $input) {
      customer {
        id
        email
        username
        firstName
        lastName
        displayName
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
        databaseId
        email
        username
        firstName
        lastName
        displayName
      }
    }
  }
`;

export const LOGOUT_CUSTOMER = gql`
  mutation LOGOUT_CUSTOMER {
    logout {
      success
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UPDATE_CUSTOMER($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        displayName
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
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation CHANGE_PASSWORD($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation RESET_PASSWORD($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation REQUEST_PASSWORD_RESET($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input) {
      success
    }
  }
`;
