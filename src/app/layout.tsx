import { NavBar } from "@/components/nav/NavBar";
import { HeroUIProvider } from "@heroui/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { NextAuthProvider } from "./providers/NextAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Report",
  description: "Academic Task Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <HeroUIProvider>
            <NavBar />
            <Suspense>{children}</Suspense>
          </HeroUIProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
