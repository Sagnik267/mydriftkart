import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/lib/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DriftKart",
  description: "Production-ready frontend for DriftKart",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
