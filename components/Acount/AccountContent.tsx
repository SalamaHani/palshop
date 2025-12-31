'use client';
import { useAuth } from "@/contexts/AuthContext";
export function AccountContent() {
    const { customer, logout } = useAuth();
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">Manage your account settings and orders</p>
            </div>

            {/* Account Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-semibold text-gray-600">
                                {customer?.email?.[0]?.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900">{customer?.email}</p>
                            <p className="text-sm text-gray-500">Logged in with passwordless authentication</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="font-medium text-gray-900">{customer?.email}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-500 mb-1">Customer ID</p>
                            <p className="font-mono text-sm text-gray-900 truncate">
                                {customer?.id || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Orders</p>
                        <p className="text-sm text-gray-500">View order history</p>
                    </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Addresses</p>
                        <p className="text-sm text-gray-500">Manage addresses</p>
                    </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Wishlist</p>
                        <p className="text-sm text-gray-500">Saved items</p>
                    </div>
                </button>
            </div>

            {/* Recent Orders Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <button className="text-sm text-gray-500 hover:text-gray-700">View all</button>
                </div>
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <a
                        href="/products"
                        className="inline-block px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Start Shopping
                    </a>
                </div>
            </div>

            {/* Sign Out */}
            <div className="text-center">
                <button
                    onClick={logout}
                    className="text-gray-500 font-medium w-fit cursor-pointer px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200  hover:text-gray-700 transition-colors"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}