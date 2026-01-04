'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Package, Loader2, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton, TableRowSkeleton } from '@/components/ui/skeleton';

interface OrderItem {
    title: string;
    quantity: number;
    variant: {
        price: {
            amount: string;
            currencyCode: string;
        };
        image?: {
            url: string;
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
    lineItems: {
        edges: Array<{
            node: OrderItem;
        }>;
    };
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setIsLoading(true);
            const response = await fetch('/api/customer/orders');
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                setError(data.error || 'Failed to load orders');
            }
        } catch (err) {
            setError('Failed to load orders');
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
            <Badge variant="outline" className={`font-semibold border ${config.className}`}>
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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
            <div className="flex flex-col gap-8">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="bg-white dark:bg-[#0d0d0d] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="h-14 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-50 dark:border-white/5 flex items-center px-8 gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32 ml-auto" />
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRowSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Orders</h1>
                    <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">Track and manage your orders</p>
                </div>
                <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center mb-6">
                        <Package className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error loading orders</h2>
                    <p className="text-[#677279] dark:text-gray-400 mb-8 max-w-xs font-medium">{error}</p>
                    <button
                        onClick={() => fetchOrders()}
                        className="px-8 py-3 bg-[#215732] text-white font-bold rounded-full hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Orders</h1>
                    <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">Track and manage your orders</p>
                </div>
                <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 transform -rotate-3 transition-transform hover:rotate-0">
                        <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-white/10" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders found</h2>
                    <p className="text-[#677279] dark:text-gray-400 mb-8 max-w-xs font-medium">
                        You haven't placed any orders yet. Once you do, they will appear here.
                    </p>
                    <Link
                        href="/categories"
                        className="inline-block px-10 py-4 bg-[#215732] text-white font-bold rounded-full hover:bg-[#1a4528] transition-all shadow-lg shadow-[#215732]/20"
                    >
                        Check out the Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-[#215732] rounded-full" />
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">My Orders</h1>
                    </div>
                    <p className="text-[#677279] dark:text-gray-400 font-medium ml-5 italic">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'} in your history
                    </p>
                </div>

                <Link href="/categories" className="ml-5 sm:ml-0">
                    <Button variant="outline" className="rounded-full border-[#215732]/20 text-[#215732] font-black uppercase text-[12px] tracking-widest hover:bg-[#215732] hover:text-white transition-all px-8 h-12">
                        Shop More
                    </Button>
                </Link>
            </div>

            {/* Orders Table Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0d0d0d] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm"
            >
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-50 dark:border-white/5 hover:bg-transparent bg-gray-50/50 dark:bg-white/[0.02]">
                                <TableHead className="font-black text-gray-400 uppercase text-[11px] tracking-widest h-14 pl-8">Order</TableHead>
                                <TableHead className="font-black text-gray-400 uppercase text-[11px] tracking-widest h-14">Date</TableHead>
                                <TableHead className="font-black text-gray-400 uppercase text-[11px] tracking-widest h-14">Items</TableHead>
                                <TableHead className="font-black text-gray-400 uppercase text-[11px] tracking-widest h-14 text-center">Payment</TableHead>
                                <TableHead className="font-black text-gray-400 uppercase text-[11px] tracking-widest h-14 text-center">Fulfillment</TableHead>
                                <TableHead className="font-black text-gray-400 uppercase text-[11px] tracking-widest h-14 text-right pr-8">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow
                                    key={order.id}
                                    className="border-gray-50 dark:border-white/5 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors group"
                                    onClick={() => window.location.href = `/account/orders/${order.id.split('/').pop()}`}
                                >
                                    <TableCell className="h-20 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#215732]/5 flex items-center justify-center group-hover:bg-[#215732]/10 transition-colors">
                                                <Package className="w-5 h-5 text-[#215732]" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 dark:text-white tracking-tight">{order.name}</p>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">#{order.orderNumber}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-400 font-bold text-sm">
                                        {formatDate(order.processedAt)}
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-400 font-bold text-sm">
                                        {order.lineItems.edges.reduce((sum, item) => sum + item.node.quantity, 0)} items
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {getStatusBadge(order.financialStatus)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {getStatusBadge(order.fulfillmentStatus)}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex flex-col items-end">
                                            <p className="font-black text-gray-900 dark:text-white">
                                                {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                                            </p>
                                            <Link
                                                href={`/account/orders/${order.id.split('/').pop()}`}
                                                className="text-[10px] font-bold text-[#215732] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Details <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>

            {/* Support Box */}
            <div className="flex flex-col items-center justify-center py-12 border-t border-gray-100 dark:border-white/5">
                <p className="text-gray-500 font-medium mb-4 italic">Having trouble with an order?</p>
                <Link href="/account/support">
                    <Button variant="ghost" className="text-[#215732] font-black h-12 uppercase tracking-widest text-[12px] hover:bg-[#215732]/5 rounded-full px-8">
                        Contact Support Team
                    </Button>
                </Link>
            </div>
        </div>
    );
}
