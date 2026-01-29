import Sidebar from "@/components/Sidebar";
import RoleSwitcher from "@/components/RoleSwitcher";
import { AuthProvider } from "@/context/AuthContext";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <AuthProvider>
            <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-[#0d111b] dark:text-white font-sans">
                <Sidebar schoolId={id} />
                <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    {children}
                </main>
                <RoleSwitcher />
            </div>
        </AuthProvider>
    );
}
