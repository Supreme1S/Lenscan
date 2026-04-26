import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LayoutShell } from "@/components/layout/LayoutShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lenscan",
  description: "Sui-native portfolio viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)]">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
