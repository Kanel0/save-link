"use client";
import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head"; // Import Next.js Head component
import "./globals.css";
import Loading from "@/components/loading/Loading";

// Load Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Update document title dynamically during loading
  useEffect(() => {
    let dots = "";
    const updateTitle = () => {
      if (document.readyState !== "complete") {
        dots = dots.length < 3 ? dots + "." : "";
        document.title = `Chargement en cours${dots}`;
      } else {
        document.title = "Hello";
        clearInterval(titleInterval);
      }
    };

    const titleInterval = setInterval(updateTitle, 500);
    return () => clearInterval(titleInterval); // Cleanup on unmount
  }, []);

  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Chargement en cours</title>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isLoading ? <Loading /> : children}
      </body>
    </html>
  );
}