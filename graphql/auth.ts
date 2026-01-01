import { gql } from "graphql-tag";
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

export const CUSTOMER_INFO_QUERY = gql`
  query getCustomerInfo {
    customer {
      id
      email
      firstName
      lastName
    }
  }
`;

export const CUSTOMER_ORDERS_QUERY = gql`
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                      altText
                    }
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

export const CUSTOMER_UPDATE = gql`
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
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
// export const CUSTOMER_CREATE = `
//   mutation customerCreate($input: CustomerCreateInput!) {
//     customerCreate(input: $input) {
//       customer {
//         id
//         email
//         firstName
//         lastName
//       }
//       customerUserErrors {
//         code
//         field
//         message
//       }
//     }
//   }
// `;

export const CUSTOMER_ACCESS_TOKEN_CREATE = `
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

export const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      createdAt
      defaultAddress {
        id
        address1
        address2
        city
        country
        province
        zip
      }
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            totalPrice {
              amount
              currencyCode
            }
            processedAt
            fulfillmentStatus
          }
        }
      }
    }
  }
`;

export const ADMIN_CUSTOMER_BY_EMAIL = `
query CustomerByEmail($email: String!) {
  customers(first: 1, query: $email) {
    edges {
      node {
        id
        email
        state
      }
    }
  }
}
`;

export const ADMIN_CUSTOMER_CREATE = `
      mutation CreateCustomer($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          userErrors {
            message
            field
          }
        }
      }
    `;


export const CUSTOMER_CREATE = `
mutation CustomerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
    }
    customerUserErrors {
      field
      message
    }
  }
}
`

export const CUSTOMER_UPDATE_PROFILE = `
mutation customerUpdate(
  $customerAccessToken: String!,
  $customer: CustomerUpdateInput!
) {
  customerUpdate(
    customerAccessToken: $customerAccessToken
    customer: $customer
  ) {
    customer {
      id
      firstName
      phone
    }
    customerUserErrors {
      field
      message
    }
  }
}

`
export const CUSTOMER_ADDRESS_CREATE = `
mutation customerAddressCreate(
  $customerAccessToken: String!
  $address: MailingAddressInput!
) {
  customerAddressCreate(
    customerAccessToken: $customerAccessToken
    address: $address
  ) {
    customerAddress {
      id
      address1
      city
      phone
      province
      zip
      country
    }
    customerUserErrors {
      message
      field
    }
  }
}
`;
//edit customer address
export const CUSTOMER_ADDRESS_UPDATE = `
mutation customerAddressUpdate(
  $customerAccessToken: String!
  $id: ID!
  $address: MailingAddressInput!
) {
  customerAddressUpdate(
    customerAccessToken: $customerAccessToken
    id: $id
    address: $address
  ) {
    customerAddress {
      id
    }
    customerUserErrors {
      message
    }
  }
}
`;

export const CUSTOMER_ADDRESS_DELETE = `
mutation customerAddressDelete(
  $customerAccessToken: String!
  $id: ID!
) {
  customerAddressDelete(
    customerAccessToken: $customerAccessToken
    id: $id
  ) {
    deletedCustomerAddressId
    customerUserErrors {
      message
    }
  }
}
`;

export const CUSTOMER_DEFAULT_ADDRESS_SET = `
mutation customerDefaultAddressUpdate(
  $customerAccessToken: String!
  $addressId: ID!
) {
  customerDefaultAddressUpdate(
    customerAccessToken: $customerAccessToken
    addressId: $addressId
  ) {
    customer {
      id
    }
    customerUserErrors {
      message
    }
  }
}
`;
export const CUSTOMER_ADDRESSES = `
query getCustomerAddresses($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    addresses(first: 20) {
      edges {
        node {
          id
          address1
          city
          phone
          province
          zip
          country
        }
      }
    }
  }
}
`;

