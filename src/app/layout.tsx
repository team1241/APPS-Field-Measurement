import type { Metadata } from "next";
import "./globals.css";
import { RootProviders } from "@/components/providers/root-providers";
import { cn } from "@/lib/utils";
import { brandFont, headingFont, monoFont, sansFont } from "./fonts";

export const metadata: Metadata = {
  description: "Plan, measure, and export field layouts.",
  title: "Field Measurement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "h-full",
        "antialiased",
        sansFont.className,
        sansFont.variable,
        brandFont.variable,
        monoFont.variable,
        headingFont.variable
      )}
      lang="en"
    >
      <body className="flex min-h-full flex-col">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
