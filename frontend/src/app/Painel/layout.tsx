import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "@/app/providers";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "./components/navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raízes Digitais",
  description: "Faça login na sua conta Raízes Digitais",
};

export default function RootLayout1({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
           <ToastProvider>
          <main className="min-h-screen">
            <Navbar />
            {children}
          </main>
          <Toaster />
        </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}