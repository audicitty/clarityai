// Root layout: applies Geist font, dark background, and global metadata

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${APP_NAME} — Turn chaos into clarity`,
  description: APP_DESCRIPTION,
  openGraph: {
    title: `${APP_NAME} — Turn chaos into clarity`,
    description: APP_DESCRIPTION,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text-primary font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
