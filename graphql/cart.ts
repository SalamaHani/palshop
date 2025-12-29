import { gql } from 'graphql-tag';

// Fragment for cart line items
export const CART_LINE_FRAGMENT = gql`
  fragment CartLine on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        priceV2 {
          amount
          currencyCode
        }
        image {
          url
          altText
          width
          height
        }
        product {
          id
          title
          handle
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
  }
`;

// Fragment for full cart details
export const CART_FRAGMENT = gql`
  ${CART_LINE_FRAGMENT}
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      edges {
        node {
          ...CartLine
        }
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    discountCodes {
      code
      applicable
    }
    attributes {
      key
      value
    }
  }
`;

// Create a new cart
export const CREATE_CART = gql`
  ${CART_FRAGMENT}
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Add items to cart
export const ADD_TO_CART = gql`
  ${CART_FRAGMENT}
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Update cart line quantities
export const UPDATE_CART_LINES = gql`
  ${CART_FRAGMENT}
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Remove items from cart
export const REMOVE_FROM_CART = gql`
  ${CART_FRAGMENT}
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Get cart by ID
export const GET_CART = gql`
  ${CART_FRAGMENT}
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...Cart
    }
  }
`;

// Apply discount code
export const APPLY_DISCOUNT = gql`
  ${CART_FRAGMENT}
  mutation ApplyDiscount($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Update cart attributes (for notes, gift messages, etc.)
export const UPDATE_CART_ATTRIBUTES = gql`
  ${CART_FRAGMENT}
  mutation UpdateCartAttributes($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Update buyer identity (for customer association)
export const UPDATE_BUYER_IDENTITY = gql`
  ${CART_FRAGMENT}
  mutation UpdateBuyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;
