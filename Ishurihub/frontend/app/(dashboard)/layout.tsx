import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-[#0d111b] dark:text-white font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
