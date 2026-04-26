import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeScript } from "@/components/providers/ThemeScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lenscan — Sui portfolio scanner",
  description:
    "Sui-native portfolio scanner. Tokens, DeFi, NFTs and transactions for any Sui wallet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)]">
        <AppProviders>
          <LayoutShell>{children}</LayoutShell>
        </AppProviders>
      </body>
    </html>
  );
}
