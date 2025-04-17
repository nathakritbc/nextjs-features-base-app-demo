import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/lib/providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Demo App",
  description: "A demo application built with Next.js and Zustand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50 pt-4">{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
