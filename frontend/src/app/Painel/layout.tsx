import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@app/globals.css";
import Providers from "@/app/providers";
import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/footer";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
           <ToastProvider>
          <main className="min-h-screen bg-slate-950">
            {children}
          <Footer />
          </main>
          <Toaster />
        </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}