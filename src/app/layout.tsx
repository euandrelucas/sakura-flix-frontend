import type React from "react";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SakuraFlix | Anime Streaming Platform",
  description: "Stream your favorite anime shows and movies in HD quality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.className} bg-background text-foreground antialiased`}
      >

          <div className="flex min-h-screen flex-col">
            <Navbar />
            {/* Dê um padding da navbar para o contedo */}
            <div className="h-16" />
            {/* Aqui fica o conteúdo da página */}
            <main className="flex-1">{children}</main>
            {/* Aqui fica o footer */}
            <div className="h-16" />
            {/* Footer */}
            <Footer />
          </div>
      </body>
    </html>
  );
}
