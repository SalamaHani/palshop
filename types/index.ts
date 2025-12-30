import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface CustomerCreateResponse {
  customerCreate: {
    customer: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
    customerUserErrors: {
      code: string;
      field: string[];
      message: string;
    }[];
  };
}

export interface CustomerUpdateResponse {
  customerUpdate: {
    customer: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
    customerUserErrors: {
      code: string;
      field: string[];
      message: string;
    }[];
  };
}

export interface CustomerResponse {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface ImageNode {
  node: {
    url: string | StaticImport;
    altText: string | null;
  };
}
export interface CustomerCreateResult {
  customerCreate: {
    customer: { id: string; email: string; firstName: string | null; lastName: string | null } | null;
    customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
  };
}

export interface CustomerAccessTokenResult {
  customerAccessTokenCreate: {
    customerAccessToken: { accessToken: string; expiresAt: string } | null;
    customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
  };
}

interface CustomerQueryResult {
  customer: ShopifyCustomer | null;
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  acceptsMarketing: boolean;
  createdAt: string;
  defaultAddress: {
    id: string;
    address1: string;
    address2: string | null;
    city: string;
    country: string;
    province: string;
    zip: string;
  } | null;
  orders: { edges: Array<{ node: { id: string; orderNumber: number; totalPrice: { amount: string; currencyCode: string }; processedAt: string; fulfillmentStatus: string } }> };
}

export interface ImageEdges {
  edges: ImageNode[];
}
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2024-10/graphql.json";
