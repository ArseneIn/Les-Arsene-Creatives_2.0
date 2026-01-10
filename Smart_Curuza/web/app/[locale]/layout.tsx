import type { Metadata } from "next";
import { Montserrat, Poppins, Playfair_Display } from "next/font/google";
import "../globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// Playfair Display - Elegant serif for headings
const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

// Montserrat - Modern geometric sans-serif for body text (replacing Inter)
const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
});

// Poppins - Modern sans-serif for UI elements
const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-poppins',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Smart-Curuza Control Tower",
    description: "Fintech ERP for informal traders",
};

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale} className={`${playfair.variable} ${montserrat.variable} ${poppins.variable}`} suppressHydrationWarning>
            <body className="font-body">
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
