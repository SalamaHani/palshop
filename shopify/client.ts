/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/shopify/client.ts
import { GET_PRODUCT_BY_HANDLE_QUERY } from "@/graphql/products";
import { DocumentNode } from "graphql";

const graphqlEndpoint = process.env.SHOPIFY_PUBLIC_CUSTOMER_ACCOUNT_API_DOMIN;;

export const fetchShopify = async <T = any>(
  query: any,
  variables: Record<string, any> = {},
  endpointType: "storefront" | "customer-account" = "customer-account"
): Promise<T> => {
  const queryString = typeof query === "string" ? query : (query.loc?.source.body || "");
  const isAuthMutation = queryString.includes('customerSendLoginCode') ||
    queryString.includes('customerVerifyCode') ||
    queryString.includes('customerAccessTokenCreateWithCode');

  try {
    // Extract access token from cookies if available (for authenticated requests to the proxy)
    // Only send the token if it's NOT an auth mutation to avoid "Invalid Token" errors from old cookies
    const accessToken = (!isAuthMutation && typeof window !== "undefined")
      ? document.cookie.split('; ').find(row => row.startsWith('customerAccessToken='))?.split('=')[1]
      : null;

    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify({
        endpointType,
        query: queryString,
        variables,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return data.data;
  } catch (error) {
    console.error(`Shopify ${endpointType} Request Error:`, error);
    throw error;
  }
};

export const fetchGraphQL = async <T = any>(
  query: DocumentNode,
  variables?: Record<string, any>
): Promise<T> => {
  return fetchShopify<T>(query, variables, "storefront");
};

export const getProduct = async (handle: string) => {
  const data = await fetchGraphQL(GET_PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.product;
};
