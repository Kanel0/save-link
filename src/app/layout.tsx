"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loading from "@/components/loading/Loading";

// Fonts Google
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
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Simule un délai de chargement
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Met à jour le titre de la page pendant le chargement
  useEffect(() => {
    if (typeof window === "undefined") return;

    let dots = "";
    const updateTitle = () => {
      if (isLoading) {
        dots = dots.length < 3 ? dots + "." : "";
        document.title = `Chargement en cours${dots}`;
      } else {
        document.title = "SaveLink";
        clearInterval(titleInterval);
      }
    };

    const titleInterval = setInterval(updateTitle, 500);
    return () => clearInterval(titleInterval);
  }, [isLoading]);

  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SaveLink</title>
      </head>
      <body
  suppressHydrationWarning
  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
>
  {isLoading ? <Loading /> : children}
</body>

    </html>
  );
}
