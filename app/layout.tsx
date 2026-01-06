import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import { cookies } from "next/headers";
import ParticlesBackground from "./_components/ParticlesBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barkin Buyuksagin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDark = (await cookies()).get('isDark')?.value === '1';

  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      {process.env.NODE_ENV === 'production' && <SpeedInsights />}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ParticlesBackground themeColor={'#3b82f6'} />
        {children}
      </body>
    </html>
  );
}
