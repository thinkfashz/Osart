
import React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: "Osart Elite | Premium Engineering",
  description: "Plataforma de ingeniería electrónica y robótica de alta fidelidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jakarta.variable}`}>
      <body className="antialiased bg-[#fcfcfd] text-[#0f172a] font-sans">
        {children}
      </body>
    </html>
  );
}
