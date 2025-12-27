import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      [`${process.env.SHOPIFY_PUBLIC_CUSTOMER_ACCOUNT_API_DOMIN}`]: {
        headers: {
          "X-Shopify-Storefront-Access-Token":
            process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
          "Content-Type": "application/json",
        },
      },
    },
  ],
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/types/shopify-graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        fetcher: {
          endpoint: process.env.SHOPIFY_PUBLIC_CUSTOMER_ACCOUNT_API_DOMIN,
          fetchParams: {
            headers: {
              "X-Shopify-Storefront-Access-Token":
                process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
          },
        },
      },
    },
  },
};

export default config;
