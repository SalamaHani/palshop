'use client';

import { useEffect, useState, use } from 'react';
import {
    ShoppingBag,
    Package,
    Loader2,
    ArrowLeft,
    Calendar,
    CreditCard,
    Truck,
    MapPin,
    ExternalLink,
    ChevronRight,
    Search
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
    title: string;
    quantity: number;
    variant: {
        title: string;
        price: {
            amount: string;
            currencyCode: string;
        };
        image?: {
            url: string;
            altText?: string;
        };
        product: {
            handle: string;
        };
    };
}

interface Order {
    id: string;
    name: string;
    orderNumber: number;
    processedAt: string;
    financialStatus: string;
    fulfillmentStatus: string;
    totalPrice: {
        amount: string;
        currencyCode: string;
    };
    subtotalPrice: {
        amount: string;
        currencyCode: string;
    };
    totalTax: {
        amount: string;
        currencyCode: string;
    };
    totalShippingPrice: {
        amount: string;
        currencyCode: string;
    };
    shippingAddress?: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        province: string;
        zip: string;
        country: string;
        phone: string;
    };
    lineItems: {
        edges: Array<{
            node: OrderItem;
        }>;
    };
}


export default function OrderDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchOrderDetails(params.id);
        }
    }, [params.id]);

    async function fetchOrderDetails(orderId: string) {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/customer/orders/${orderId}`);
            const data = await response.json();

            if (data.success) {
                setOrder(data.order);
            } else {
                setError(data.error || 'Failed to load order details');
            }
        } catch (err) {
            setError('Failed to load order details');
        } finally {
            setIsLoading(false);
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            PENDING: { label: 'Pending', className: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20' },
            PAID: { label: 'Paid', className: 'bg-[#215732]/10 text-[#215732] dark:text-[#2d7d45] border-[#215732]/20' },
            PARTIALLY_PAID: { label: 'Partial Payment', className: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
            REFUNDED: { label: 'Refunded', className: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' },
            VOIDED: { label: 'Voided', className: 'bg-gray-50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/20' },
            FULFILLED: { label: 'Delivered', className: 'bg-[#215732]/10 text-[#215732] dark:text-[#2d7d45] border-[#215732]/20' },
            UNFULFILLED: { label: 'Processing', className: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' },
            PARTIALLY_FULFILLED: { label: 'Partial Delivery', className: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
        };

        const config = statusConfig[status] || { label: status, className: 'bg-gray-50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-500/20' };
        return (
            <Badge variant="outline" className={`font-bold border px-3 py-1 rounded-full ${config.className}`}>
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (amount: string, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(parseFloat(amount));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-[#215732] animate-spin mb-4" />
                <p className="text-gray-500 font-medium italic">Retreiving your order details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Order not found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">{error || "We couldn't find the order you're looking for."}</p>
                <Link href="/account/orders">
                    <Button variant="outline" className="rounded-full px-8 border-[#215732] text-[#215732] hover:bg-[#215732] hover:text-white transition-all font-bold">
                        Back to Orders
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Header / Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link
                        href="/account/orders"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#215732] hover:underline underline-offset-4 mb-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                            Order {order.name}
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#677279] dark:text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.processedAt)}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline opacity-20">•</span>
                            {getStatusBadge(order.fulfillmentStatus)}
                            {getStatusBadge(order.financialStatus)}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="rounded-full border-[#215732]/20 hover:border-[#215732] text-[#215732] font-bold"
                        onClick={() => window.print()}
                    >
                        Print Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-white/5">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-[#215732]" />
                                Order Items
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {order.lineItems.edges.map(({ node: item }, index) => (
                                <div key={index} className="p-6 sm:p-8 flex items-start gap-4 sm:gap-6 group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/10">
                                        {item.variant?.image?.url ? (
                                            <Image
                                                src={item.variant.image.url}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                            <div>
                                                <Link
                                                    href={`/product/${item.variant?.product?.handle}`}
                                                    className="text-[17px] font-bold text-gray-900 dark:text-white hover:text-[#215732] transition-colors line-clamp-1"
                                                >
                                                    {item.title}
                                                </Link>
                                                <p className="text-sm font-medium text-[#677279] dark:text-gray-400 mt-0.5">
                                                    {item.variant.title !== 'Default Title' ? item.variant.title : 'Standard Edition'}
                                                </p>
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                {formatPrice(item.variant.price.amount, item.variant.price.currencyCode)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold text-gray-900 dark:text-white">
                                                Qty: {item.quantity}
                                            </div>
                                            <Link
                                                href={`/product/${item.variant?.product?.handle}`}
                                                className="text-xs font-bold text-[#215732] hover:underline underline-offset-4 flex items-center gap-1"
                                            >
                                                View Product
                                                <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Card for Mobile/Tablet */}
                    <div className="lg:hidden">
                        <OrderSummary order={order} formatPrice={formatPrice} />
                    </div>
                </div>

                {/* Right Column: Order Info & Summary */}
                <div className="space-y-6">
                    {/* PC Summary */}
                    <div className="hidden lg:block">
                        <OrderSummary order={order} formatPrice={formatPrice} />
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl border border-gray-100 dark:border-white/5 p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <Truck className="w-5 h-5 text-[#215732]" />
                            Delivery Details
                        </h2>
                        {order.shippingAddress ? (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                    </p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                        {order.shippingAddress.address1}
                                        {order.shippingAddress.address2 && <>, {order.shippingAddress.address2}</>}
                                        <br />
                                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                                        <br />
                                        {order.shippingAddress.country}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        <MapPin className="w-4 h-4 text-[#215732]" />
                                        <span className="font-bold">{order.shippingAddress.country}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{order.shippingAddress.phone}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 font-medium italic">No shipping address provided.</p>
                        )}
                    </div>

                    {/* Support Link */}
                    <div className="bg-[#215732]/5 dark:bg-[#215732]/10 rounded-3xl p-6 sm:p-8 border border-[#215732]/10">
                        <h3 className="font-black text-gray-900 dark:text-white mb-2 tracking-tight italic">Need Help?</h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            If you have any questions about this order, our support team is here to help you.
                        </p>
                        <Link href="/account/support">
                            <Button className="w-full rounded-2xl bg-[#215732] hover:bg-[#1a4528] text-white font-bold h-12">
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrderSummary({ order, formatPrice }: { order: Order, formatPrice: Function }) {
    return (
        <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl border border-gray-100 dark:border-white/5 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-8">
                <CreditCard className="w-5 h-5 text-[#215732]" />
                Payment Summary
            </h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Shipping</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Tax</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                        {formatPrice(order.totalTax.amount, order.totalTax.currencyCode)}
                    </span>
                </div>

                <Separator className="my-4 bg-gray-100 dark:bg-white/5" />

                <div className="flex justify-between items-center">
                    <span className="text-[17px] font-black text-gray-900 dark:text-white tracking-tight">Total Total</span>
                    <span className="text-2xl font-black text-[#215732] tracking-tighter">
                        {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                    </span>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-[#215732]/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-[#215732]" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Status</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                                {order.fulfillmentStatus.toLowerCase()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
