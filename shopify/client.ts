/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/shopify/client.ts
import { GET_PRODUCT_BY_HANDLE_QUERY } from "@/graphql/products";
import { DocumentNode } from "graphql";

const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!}/api/2025-10/graphql.json`;
export const fetchShopify = async <T = any>(
  query: any,
  variables: Record<string, any> = {},
  endpointType: "storefront"
): Promise<T> => {
  const queryString = typeof query === "string" ? query : (query.loc?.source.body || "");
  try {

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
