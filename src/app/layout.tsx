import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ToasterProvider } from "@/components/toaster-provider";

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
        <footer className="site-footer">
          <div className="container footer-inner">
            <div className="footer-brand"><Link href="/" className="footer-logo"><span>🛒</span> বাজার দর<span className="brand-dot">।</span></Link><p>প্রয়োজনীয় পণ্যের দাম এক নজরে।</p></div>
            <div className="footer-notice"><span className="footer-notice-icon">ⓘ</span><p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p></div>
            <div className="footer-bottom"><span>© {new Date().getFullYear()} বাজার দর। সর্বস্বত্ব সংরক্ষিত।</span><span>বাংলাদেশের বাজার তথ্য, সহজ ভাষায়।</span></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
