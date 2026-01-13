import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

import "./globals.css";

import ParticlesBackground from "@/common/components/ParticlesBackground";
import { Theme } from "@/common/enums/theme";
import { getThemeCookieInServer } from "@/common/utils/cookie";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barkin Buyuksagin's Portfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeCookieInServer();

  return (
    <html lang="en" className={theme === Theme.Dark ? 'dark' : ''}>
      {process.env.NODE_ENV === 'production' &&
        <>
          <Analytics />
          <SpeedInsights />
        </>
      }
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ParticlesBackground themeColor={'#3b82f6'} />
        {children}
      </body>
    </html>
  );
}
