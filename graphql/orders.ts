import { gql } from 'graphql-tag';

// Fragment for order line items
export const ORDER_LINE_ITEM_FRAGMENT = gql`
  fragment OrderLineItem on OrderLineItem {
    title
    quantity
    originalTotalPrice {
      amount
      currencyCode
    }
    discountedTotalPrice {
      amount
      currencyCode
    }
    variant {
      id
      title
      image {
        url
        altText
      }
      price {
        amount
        currencyCode
      }
      product {
        id
        title
        handle
      }
    }
  }
`;

// Fragment for full order details
export const ORDER_FRAGMENT = gql`
  ${ORDER_LINE_ITEM_FRAGMENT}
  fragment Order on Order {
    id
    name
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    cancelReason
    canceledAt
    subtotalPrice {
      amount
      currencyCode
    }
    totalShippingPrice {
      amount
      currencyCode
    }
    totalTax {
      amount
      currencyCode
    }
    totalPrice {
      amount
      currencyCode
    }
    currentTotalPrice {
      amount
      currencyCode
    }
    lineItems(first: 100) {
      edges {
        node {
          ...OrderLineItem
        }
      }
    }
    shippingAddress {
      address1
      address2
      city
      province
      country
      zip
      firstName
      lastName
      phone
    }
    statusUrl
  }
`;

// Get customer orders
export const GET_CUSTOMER_ORDERS = gql`
  ${ORDER_FRAGMENT}
  query GetCustomerOrders($first: Int = 10, $after: String) {
    customer {
      id
      email
      firstName
      lastName
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          cursor
          node {
            ...Order
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

// Get single order by ID
export const GET_ORDER_BY_ID = gql`
  ${ORDER_FRAGMENT}
  query GetOrderById($id: ID!) {
    order: node(id: $id) {
      ... on Order {
        ...Order
      }
    }
  }
`;

// Order status helpers
export const ORDER_FINANCIAL_STATUS = {
    AUTHORIZED: 'Authorized',
    PAID: 'Paid',
    PARTIALLY_PAID: 'Partially Paid',
    PARTIALLY_REFUNDED: 'Partially Refunded',
    PENDING: 'Pending',
    REFUNDED: 'Refunded',
    VOIDED: 'Voided',
} as const;

export const ORDER_FULFILLMENT_STATUS = {
    FULFILLED: 'Fulfilled',
    IN_PROGRESS: 'In Progress',
    ON_HOLD: 'On Hold',
    OPEN: 'Processing',
    PARTIALLY_FULFILLED: 'Partially Fulfilled',
    PENDING_FULFILLMENT: 'Pending',
    RESTOCKED: 'Restocked',
    SCHEDULED: 'Scheduled',
    UNFULFILLED: 'Unfulfilled',
} as const;
