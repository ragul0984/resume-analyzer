import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ResumeTech AI | Advanced Resume Analysis",
  description: "Elevate your career with AI-driven insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        {/* ULTRA DYNAMIC BACKGROUND SYSTEM */}
        <div className="ultra-bg">
          <div className="starfield"></div>
          <div className="starfield slow"></div>
          <div className="nebula"></div>
          <div className="orb-container">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>
            <div className="orb orb-5"></div>
          </div>
          <div className="noise-overlay"></div>
          <div className="scanline"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
