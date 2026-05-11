'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import TopHeader from '@/components/TopHeader';
import { ProjectProvider } from "@/context/ProjectContext";
import { LoadingProvider, useLoading } from "@/context/LoadingContext";
import Loader from "@/components/Loader";

function AppContent({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = useLoading();
  const pathname = usePathname();
  
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <>
        {isTransitioning && <Loader />}
        {children}
      </>
    );
  }

  return (
    <>
      {isTransitioning && <Loader />}
      <div className="app-wrapper">
        <Sidebar />
        <main className="main-content">
          <TopHeader />
          {children}
        </main>
      </div>
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <ProjectProvider>
        <AppContent>
          {children}
        </AppContent>
      </ProjectProvider>
    </LoadingProvider>
  );
}
