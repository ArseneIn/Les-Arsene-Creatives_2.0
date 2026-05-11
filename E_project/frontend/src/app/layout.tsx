import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP Project Manager",
  description: "Enterprise Resource & Project Management",
};

import ClientLayout from "./ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-plus-jakarta">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
