import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import data from "../../../in/data.json"
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: `${data.preName} ${data.lastName} - Resume`,
  description: `Online Resume of ${data.preName} ${data.lastName}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
