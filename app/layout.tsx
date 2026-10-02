import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buku Petunjuk Praktikum Web - Modul 1",
  description:
    "Sistem Paralel dan Database Terdistribusi | Modul 1: Konsep Dasar Sistem Paralel & Terdistribusi — UMS Teknik Informatika",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
