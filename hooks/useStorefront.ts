import { QueryKey, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { RequestDocument } from "graphql-request";
import { fetchShopify } from "@/shopify/client";

interface QueryVariables {
  query: RequestDocument;
  variables?: Record<string, unknown>;
  enabled?: boolean;
  endpointType?: "storefront" | "customer-account";
}

interface MutationVariables {
  query: RequestDocument;
  variables: Record<string, unknown>;
  endpointType?: "storefront" | "customer-account";
}

export function useStorefrontQuery<TData = unknown>(
  queryKey: QueryKey,
  { query, variables, enabled = true, endpointType = "storefront", ...options }: QueryVariables
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      return fetchShopify<TData>(query, variables || {}, endpointType);
    },
    enabled,
    ...options,
  });
}

export function useStorefrontInfiniteQuery<TData = any>(
  queryKey: QueryKey,
  { query, variables, endpointType = "storefront" }: QueryVariables,
  getNextPageParam: (lastPage: TData) => string | null | undefined
) {
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const vars = { ...variables, after: pageParam };
      return fetchShopify<TData>(query, vars, endpointType);
    },
    initialPageParam: null as string | null,
    getNextPageParam,
  });
}

export function useStorefrontMutation<
  TData = unknown,
  TVariables extends MutationVariables = MutationVariables
>() {
  const mutation = useMutation<TData, Error, TVariables>({
    mutationFn: async ({ query, variables }) => {
      try {
        const response = await fetchShopify<TData>(query, variables);
        return response;
      } catch (error) {
        // Type guard to ensure error is an Error object
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unknown error occurred during mutation");
      }
    },
  });

  return {
    mutate: mutation.mutateAsync,
    mutateSync: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
    data: mutation.data,
  };
}
