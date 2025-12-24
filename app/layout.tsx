import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/context/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StacksPredict - Bitcoin-Native Prediction Markets",
  description: "A decentralized prediction market built on Stacks. Trade on real-world events with sBTC, featuring order books, social truth feeds, and gamified rankings.",
  keywords: ["prediction market", "stacks", "bitcoin", "sBTC", "decentralized", "betting", "forecasting"],
  authors: [{ name: "StacksPredict" }],
  openGraph: {
    title: "StacksPredict - Bitcoin-Native Prediction Markets",
    description: "Trade on real-world events with sBTC on Stacks blockchain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
