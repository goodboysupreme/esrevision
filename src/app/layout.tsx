import type { Metadata } from "next";
import { EB_Garamond, Merriweather, Chivo } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const chivo = Chivo({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EEE F111 — Electrical Sciences War Room",
  description: "Comprehensive exam study hub for EEE F111 at BITS Pilani. PYQ analysis, cheat sheets, method maps, and trap cards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ebGaramond.variable} ${merriweather.variable} ${chivo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
