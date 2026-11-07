import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { FilmGrain } from "@/components/FilmGrain";
import { CustomCursor } from "@/components/CustomCursor";
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

export const metadata: Metadata = {
  title: "Yash Sandeep Shinde - Backend & IoT Engineer",
  description:
    "Computer Science Engineering student specializing in backend architecture, IoT, and hardware-integrated systems. Experienced in C++, Java, Go, Node.js, and Python.",
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
        <CustomCursor />
        <FilmGrain />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
