import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { SEARCH_PRODUCTS_AND_COLLECTIONS } from '@/graphql/search';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ products: [], collections: [] });
    }

    try {
        const data: any = await shopifyFetch({
            query: SEARCH_PRODUCTS_AND_COLLECTIONS,
            variables: { query },
        });

        const products = data.products.edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle,
            image: edge.node.images.edges[0]?.node?.url || '',
            price: edge.node.priceRange.minVariantPrice.amount,
            currencyCode: edge.node.priceRange.minVariantPrice.currencyCode,
        }));

        const collections = data.collections.edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle,
            image: edge.node.image?.url || '',
        }));

        return NextResponse.json({ products, collections });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
    }
}
