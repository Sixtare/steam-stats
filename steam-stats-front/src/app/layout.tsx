import type { Metadata } from "next";
import { Sora, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-display-lg" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body-lg" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-label-code" });

export const metadata: Metadata = {
  title: "Steam Stats | Steam Telemetry Dashboard",
  description: "Steam Telemetry Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${hanken.variable} ${jetbrains.variable} h-full antialiased dark`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-body-lg text-on-surface">
        {children}
        <footer className="text-center opacity-40 mt-8 mb-8 md:ml-64">
          <p className="font-label-code text-xs text-on-surface-variant">
            2026 STEAM_STATS_INTEL // ENCRYPTION: ACTIVE
          </p>
        </footer>
      </body>
    </html>
  );
}
