import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
