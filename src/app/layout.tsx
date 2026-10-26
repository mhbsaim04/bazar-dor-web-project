import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ToasterProvider } from "@/components/toaster-provider";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "বাজার দর | নিত্যপণ্যের আজকের দাম", template: "%s | বাজার দর" },
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে দেখুন। বাজারভিত্তিক দামের তুলনা, পরিবর্তন ও পণ্যের বিস্তারিত তথ্য।",
  applicationName: "বাজার দর",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f8f3",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="bn">
      <body>
        <ToasterProvider />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
