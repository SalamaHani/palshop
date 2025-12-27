/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/shopify/client.ts
import { GET_PRODUCT_BY_HANDLE_QUERY } from "@/graphql/products";
import { DocumentNode } from "graphql";

const endpoint = "/api/shopify/auth";

export const fetchShopify = async <T = any>(
  query: any,
  variables: Record<string, any> = {},
  endpointType: "storefront" | "customer-account" = "customer-account"
): Promise<T> => {
  const queryString = typeof query === "string" ? query : query.loc?.source.body;

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
// export const signInWithEmail = async (email: string) => {
//   const data = await fetchGraphQL(CUSTOMER_SEND_LOGIN_CODE, { email });
//   return data?.customerSendLoginCode;
// };
// export const verifyCode = async (email: string, code: string) => {
//   const data = await fetchGraphQL(CUSTOMER_VERIFY_CODE, { email, code });
//   return data?.customerVerifyCode;
// };
