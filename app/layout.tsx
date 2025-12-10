import React from "react";
import type {Metadata} from "next";
import {Analytics} from '@vercel/analytics/react';
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {BASE_URL} from "@/lib/config";
import {Toaster} from "@/components/ui/sonner";

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL || 'http://localhost:3000'),
    title: 'Signalist',
    description: 'Track real-time stock prices, get personalized alerts and explore detailed company insights',
};

function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang={'en'} className={'dark'}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics/>
        <Toaster/>
        </body>
        </html>
    );
}

export default RootLayout;
