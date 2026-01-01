import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    );
}
