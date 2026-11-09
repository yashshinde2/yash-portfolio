import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { FilmGrain } from "@/components/FilmGrain";
import { Cursor } from "@/components/cursor";
import { Preloader } from "@/components/Preloader";
import { ScrollProgress } from "@/components/ScrollProgress";

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
  title: "Yash Sandeep Shinde - Java & C++ Developer",
  description:
    "B.Tech Computer Science and Engineering student at D. Y. Patil School of Engineering and Management, Kolhapur. Java and C++ developer, hackathon winner and open-source contributor.",
  metadataBase: new URL("https://yash-shinde.vercel.app"),
  openGraph: {
    title: "Yash Sandeep Shinde - Java & C++ Developer",
    description:
      "B.Tech Computer Science and Engineering student at D. Y. Patil School of Engineering and Management, Kolhapur. Java and C++ developer, hackathon winner and open-source contributor.",
    url: "https://yash-shinde.vercel.app",
    siteName: "Yash Sandeep Shinde Portfolio",
    images: [
      {
        url: "https://yash-shinde.vercel.app/yash.png",
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
    title: "Yash Sandeep Shinde - Java & C++ Developer",
    description:
      "B.Tech Computer Science and Engineering student at D. Y. Patil School of Engineering and Management, Kolhapur. Java and C++ developer, hackathon winner and open-source contributor.",
    images: ["https://yash-shinde.vercel.app/yash.png"],
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
        <ScrollProgress />
        <Preloader />
        <Cursor />
        <FilmGrain />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
