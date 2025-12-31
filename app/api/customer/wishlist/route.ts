import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { shopifyAdminFetch } from "@/lib/shopify";

const GET_CUSTOMER_WISHLIST_ADMIN = `
  query getCustomerWishlist($id: ID!) {
    customer(id: $id) {
      wishlist: metafield(namespace: "custom", key: "wishlist") {
        value
      }
    }
  }
`;

const UPDATE_CUSTOMER_WISHLIST_ADMIN = `
  mutation updateCustomerWishlist($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        metafield(namespace: "custom", key: "wishlist") {
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

export async function GET() {
    const session = await getSession();
    if (!session?.customerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await shopifyAdminFetch(GET_CUSTOMER_WISHLIST_ADMIN, {
            id: session.customerId
        });

        const wishlistValue = data?.customer?.wishlist?.value || "[]";
        const ids = JSON.parse(wishlistValue);

        return NextResponse.json({ wishlist: ids });
    } catch (error: any) {
        console.error("[Wishlist API GET] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session?.customerId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { wishlist } = await request.json();
        if (!Array.isArray(wishlist)) {
            return NextResponse.json({ error: "Invalid wishlist format" }, { status: 400 });
        }

        const data = await shopifyAdminFetch(UPDATE_CUSTOMER_WISHLIST_ADMIN, {
            input: {
                id: session.customerId,
                metafields: [
                    {
                        namespace: "custom",
                        key: "wishlist",
                        value: JSON.stringify(wishlist),
                        type: "json"
                    }
                ]
            }
        });

        if (data?.customerUpdate?.userErrors?.length) {
            return NextResponse.json({ error: data.customerUpdate.userErrors[0].message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Wishlist API POST] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
