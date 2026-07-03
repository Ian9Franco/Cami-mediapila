import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tengo una pregunta... 👀",
  description: "Preparé una propuesta especial para Camila. Abrí el sobre para ver de qué se trata.",
  openGraph: {
    title: "Tengo una pregunta... 👀",
    description: "Preparé una propuesta especial para Camila. Abrí el sobre para ver de qué se trata.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fff8f8] text-[#2d0b25]">
        {children}
      </body>
    </html>
  );
}

