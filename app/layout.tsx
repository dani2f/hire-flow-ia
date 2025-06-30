// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HireFlow – Envío de Candidaturas con IA",
  description:
    "Aplicación para enviar propuestas de trabajo personalizadas con ayuda de IA para Daniel Gómez Cuevas",
  icons: {
    icon: "/hireFlowIcon.svg",            // <link rel="icon" href="/favicon.ico" />

  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
