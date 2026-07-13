import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Wear Floral | Elegant Desi Fashion",
    template: "%s | Wear Floral",
  },
  description:
    "Shop premium desi women's clothing — lawn suits, kurtis, shalwar kameez, dupattas and accessories.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: ["/favicon-32.png"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white text-stone-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
