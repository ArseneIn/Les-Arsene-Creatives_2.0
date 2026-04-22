import type { Metadata } from "next";
import "./globals.css";
import TopHeader from '@/components/TopHeader';

export const metadata: Metadata = {
  title: "ERP Project Manager",
  description: "Enterprise Resource & Project Management",
};

import Sidebar from "@/components/Sidebar";

import { ProjectProvider } from "@/context/ProjectContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ProjectProvider>
          <div className="app-wrapper">
            <Sidebar />
            
            <main className="main-content">
            <TopHeader />
            {children}
          </main>
        </div>
        </ProjectProvider>
      </body>
    </html>
  );
}
