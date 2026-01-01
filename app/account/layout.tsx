import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { AccountSidebar } from "@/components/Acount/AccountSidebar";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <AccountSidebar />
                        <div className="flex-1 min-w-0">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
