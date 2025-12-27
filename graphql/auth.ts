import { gql } from "graphql-tag";

export const CUSTOMER_ACCESS_TOKEN_CREATE = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_CREATE = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_WITH_CODE = gql`
  mutation customerAccessTokenCreateWithCode($email: String!, $code: String!) {
    customerAccessTokenCreateWithCode(email: $email, code: $code) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;




export const CUSTOMER_QUERY = gql`
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_DELETE = gql`
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;
export const CUSTOMER_SEND_LOGIN_CODE = gql`
  mutation customerSendLoginCode($email: String!) {
    customerSendLoginCode(email: $email) {
      emailInputNextStep {
        nextStep
        encryptedState
        userErrors {
          field
          message
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
export const CUSTOMER_VERIFY_CODE = gql`
  mutation customerVerifyCode($email: String!, $code: String!, $encryptedState: String) {
    customerVerifyCode: customerAccessTokenCreateWithCode(email: $email, code: $code, encryptedState: $encryptedState) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerAccessTokenNextStep {
        nextStep
        encryptedState
        userErrors {
          field
          message
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
