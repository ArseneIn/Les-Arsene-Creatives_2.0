import SuperAdminSidebar from "@/components/SuperAdminSidebar";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#0f172a] text-[#0d111b] dark:text-white font-sans">
            <SuperAdminSidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
