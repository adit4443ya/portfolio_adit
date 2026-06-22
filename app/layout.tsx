import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditya Trivedi — Compiler Engineer",
  description:
    "An explorable 3D portfolio. Compiler IR, parallel runtimes, GPU offloading — GSoC ’25 at Fortran-Lang, LFortran core contributor, four papers, joining Qualcomm’s ARM compiler team.",
  authors: [{ name: "Aditya Trivedi" }],
  openGraph: {
    title: "Aditya Trivedi — Compiler Engineer",
    description:
      "Drive through an explorable 3D world of compiler, HPC and research work.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06070b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
