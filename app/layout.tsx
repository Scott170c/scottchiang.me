import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "scottchiang.me",
  description: "A quick Vercel deployment smoke test.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
