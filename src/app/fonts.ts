import {
  Geist,
  Geist_Mono,
  Nunito_Sans,
  Space_Grotesk,
} from "next/font/google";

export const brandFont = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const headingFont = Nunito_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const sansFont = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const monoFont = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
