import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { FilmGrain } from "@/components/FilmGrain";
import { Cursor } from "@/components/cursor";
import { Preloader } from "@/components/Preloader";

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Yash Sandeep Shinde - Backend & IoT Engineer",
  description:
    "Computer Science Engineering student specializing in backend architecture, IoT, and hardware-integrated systems. Experienced in C++, Java, Go, Node.js, and Python.",
  metadataBase: new URL("https://yashshinde.dev"),
  openGraph: {
    title: "Yash Sandeep Shinde - Backend & IoT Engineer",
    description:
      "Computer Science Engineering student specializing in backend architecture, IoT, and hardware-integrated systems.",
    url: "https://yashshinde.dev",
    siteName: "Yash Sandeep Shinde Portfolio",
    images: [
      {
        url: "/yash.png",
        width: 720,
        height: 960,
        alt: "Yash Sandeep Shinde - Monochrome Portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Sandeep Shinde - Backend & IoT Engineer",
    description:
      "Computer Science Engineering student specializing in backend architecture, IoT, and hardware-integrated systems.",
    images: ["/yash.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} bg-black text-white dark`}
    >
      <body className="bg-black text-white antialiased font-sans selection:bg-white selection:text-black min-h-screen">
        <Preloader />
        <Cursor />
        <FilmGrain />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
