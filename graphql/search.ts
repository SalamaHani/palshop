export const SEARCH_PRODUCTS_AND_COLLECTIONS = `
  query search($query: String!) {
    products(first: 6, query: $query) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
    collections(first: 4, query: $query) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;
