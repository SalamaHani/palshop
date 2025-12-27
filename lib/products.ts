export interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    description: string;
}

export const products: Product[] = [
    {
        id: 'gid://shopify/Product/1',
        name: 'Organic Olive Oil',
        price: 24.99,
        rating: 4.8,
        reviews: 543,
        image: '/images/Accessories-pal.avif',
        category: 'Food',
        description: 'Premium Palestinian extra virgin olive oil from ancient groves'
    },
    {
        id: 'gid://shopify/Product/2',
        name: 'Hand-Embroidered Scarf',
        price: 45.00,
        rating: 4.9,
        reviews: 321,
        image: '/images/Hoody-pal.avif',
        category: 'Fashion',
        description: 'Traditional Palestinian embroidery on pure silk'
    },
    {
        id: 'gid://shopify/Product/3',
        name: 'Za\'atar Spice Mix',
        price: 12.99,
        rating: 4.7,
        reviews: 789,
        image: '/images/palestineCaps-pal.avif',
        category: 'Food',
        description: 'Authentic Palestinian za\'atar blend with wild thyme'
    },
    {
        id: 'gid://shopify/Product/4',
        name: 'Ceramic Bowl Set',
        price: 68.00,
        rating: 4.9,
        reviews: 234,
        image: '/images/Maps-decors-pal.avif',
        category: 'Home',
        description: 'Hand-painted traditional Palestinian ceramic bowls'
    },
    {
        id: 'gid://shopify/Product/5',
        name: 'Natural Soap Collection',
        price: 32.50,
        rating: 4.8,
        reviews: 657,
        image: '/images/Iawlary-pal.webp',
        category: 'Beauty',
        description: 'Handcrafted olive oil and herb soaps from Nablus'
    },
    {
        id: 'gid://shopify/Product/6',
        name: 'Keffiyeh Scarf',
        price: 29.99,
        rating: 4.0,
        reviews: 892,
        image: '/images/kpfia-pal.webp',
        category: 'Fashion',
        description: 'Authentic Palestinian keffiyeh, traditionally woven'
    },
    {
        id: 'gid://shopify/Product/7',
        name: 'Date Syrup',
        price: 15.99,
        rating: 3.6,
        reviews: 445,
        image: '/images/food-pal.webp',
        category: 'Food',
        description: 'Pure Palestinian date syrup, naturally sweet'
    },
    {
        id: 'gid://shopify/Product/8',
        name: 'Wooden Jewelry Box',
        price: 52.00,
        rating: 4.9,
        reviews: 178,
        image: '/images/jewelry-box-pal.avif',
        category: 'Home',
        description: 'Intricate mother-of-pearl inlay jewelry box'
    },
    {
        id: 'gid://shopify/Product/9',
        name: 'Organic Olive Oil',
        price: 24.99,
        rating: 4.8,
        reviews: 543,
        image: '/images/Accessories-pal.avif',
        category: 'Food',
        description: 'Premium Palestinian extra virgin olive oil from ancient groves'
    },
    {
        id: 'gid://shopify/Product/10',
        name: 'Hand-Embroidered Scarf',
        price: 45.00,
        rating: 4.4,
        reviews: 321,
        image: '/images/Hoody-pal.avif',
        category: 'Fashion',
        description: 'Traditional Palestinian embroidery on pure silk'
    },
    {
        id: 'gid://shopify/Product/11',
        name: 'Za\'atar Spice Mix',
        price: 12.99,
        rating: 4.7,
        reviews: 789,
        image: '/images/palestineCaps-pal.avif',
        category: 'Food',
        description: 'Authentic Palestinian za\'atar blend with wild thyme'
    },
    {
        id: 'gid://shopify/Product/12',
        name: 'Ceramic Bowl Set',
        price: 68.00,
        rating: 4.9,
        reviews: 234,
        image: '/images/Maps-decors-pal.avif',
        category: 'Home',
        description: 'Hand-painted traditional Palestinian ceramic bowls'
    },
    {
        id: 'gid://shopify/Product/13',
        name: 'Natural Soap Collection',
        price: 32.50,
        rating: 4.8,
        reviews: 657,
        image: '/images/Iawlary-pal.webp',
        category: 'Beauty',
        description: 'Handcrafted olive oil and herb soaps from Nablus'
    },
    {
        id: 'gid://shopify/Product/14',
        name: 'Keffiyeh Scarf',
        price: 29.99,
        rating: 5.0,
        reviews: 892,
        image: '/images/kpfia-pal.webp',
        category: 'Fashion',
        description: 'Authentic Palestinian keffiyeh, traditionally woven'
    },
    {
        id: 'gid://shopify/Product/15',
        name: 'Date Syrup rich',
        price: 15.99,
        rating: 4.6,
        reviews: 445,
        image: '/images/date-pal.avif',
        category: 'Food',
        description: 'Pure Palestinian date syrup, naturally sweet'
    },
    {
        id: 'gid://shopify/Product/16',
        name: 'Wooden Jewelry Box',
        price: 52.00,
        rating: 4.9,
        reviews: 178,
        image: '/images/jewelry-box-pal.avif',
        category: 'Home',
        description: 'Intricate mother-of-pearl inlay jewelry box'
    },
];

export const categories = [
    { name: 'All', slug: 'all' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Food', slug: 'food' },
    { name: 'Home', slug: 'home' },
];
