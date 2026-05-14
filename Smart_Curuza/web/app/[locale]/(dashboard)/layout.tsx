import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/auth/AuthGuard";
import PageLoader from "@/components/ui/PageLoader";
import GlobalApprovalModal from "@/components/GlobalApprovalModal";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard>
            <PageLoader />
            <GlobalApprovalModal />
            <div className="flex h-screen bg-transparent">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
