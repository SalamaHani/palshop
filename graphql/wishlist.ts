import { gql } from "graphql-tag";

/**
 * Professional Shopify Wishlist GraphQL
 * Using Customer Metafields instead of Cart API for true persistence and separation of concerns.
 */

// 1. Get the customer's wishlist metafield (Customer Account API)
export const GET_CUSTOMER_WISHLIST = gql`
  query getCustomerWishlist {
    customer {
      id
      wishlist: metafield(namespace: "custom", key: "wishlist") {
        id
        value
      }
    }
  }
`;

// 2. Update the customer's wishlist metafield (Customer Account API)
export const UPDATE_CUSTOMER_WISHLIST = gql`
  mutation updateCustomerWishlist($metafields: [MetafieldUpdateInput!]!) {
    customerUpdate(customer: { metafields: $metafields }) {
      customer {
        id
        wishlist: metafield(namespace: "custom", key: "wishlist") {
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// 3. Fetch product details for a list of IDs (Storefront API)
export const GET_WISHLIST_PRODUCTS = gql`
  query getWishlistProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        vendor
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

// 4. (Alternative) Search products by a query if needed
export const SEARCH_WISHLIST_PRODUCTS = gql`
  query searchWishlistProducts($query: String!) {
    products(first: 250, query: $query) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
