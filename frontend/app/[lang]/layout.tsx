import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import "@/app/globals.css";
import { getDictionary } from "@/lib/dictionaries";
import { toLocale } from "@/lib/i18n";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "next-auth/react";
import { SonnerProvider } from "@/providers/sonner-provider";
import { Navbar } from "@/ui/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wallet Dashboard",
  description: "Wallet and transactions frontend",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const locale = toLocale(lang);

  if (!locale) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <SessionProvider>
            <Navbar locale={locale} copy={dict.navbar} />
            {children}
            <SonnerProvider />
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

