import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday Laiba Ahmad 🎂💖",
  description: "A special birthday celebration for the most amazing person - Moiiiiiiii Wifey G. Its 23rd Birthday of my Sweet potato 🎂💖",
  keywords: ["birthday", "Laiba Ahmad", "celebration", "love"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
