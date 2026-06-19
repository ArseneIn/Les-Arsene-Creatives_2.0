import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import 'material-symbols/outlined.css';
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MaintenanceProvider } from "@/components/system/MaintenanceProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ishuri Hub",
  description: "School Management System with NFC Integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.variable} ${plusJakartaSans.variable} antialiased font-sans bg-slate-50 dark:bg-[#0f172a]`}>
        <AuthProvider>
          <MaintenanceProvider>
            {children}
          </MaintenanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
