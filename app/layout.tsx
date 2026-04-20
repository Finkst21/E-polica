import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Merriweather } from "next/font/google";

import "./globals.css";

import { AppProviders } from "@/components/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";

const heading = Merriweather({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700"]
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "E-polica",
  description: "Sodobna platforma za branje, ocenjevanje in upravljanje knjig."
};

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="sl" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable} min-h-screen font-sans`}>
        <AppProviders>{children}</AppProviders>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
