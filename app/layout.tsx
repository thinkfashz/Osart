import React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Osart Elite | Ingeniería Sin Límites",
  description: "Plataforma de ingeniería electrónica y robótica de alta fidelidad.",
};

// Fixed: Added React import to provide the React namespace for type definitions on line 15
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${jakarta.className} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
