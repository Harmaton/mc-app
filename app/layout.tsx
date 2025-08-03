import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/lib/convexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/storefront/cart-provider";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MillCarry Bags",
  description: "A platform for buying and selling bags of various categories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
       <ClerkProvider>
      <ConvexClientProvider>
        <CartProvider>
       <main className="min-h-screen">{children}</main> 
        </CartProvider>
        <Toaster position="top-right" richColors />
        </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
