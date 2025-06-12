import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zhemwel Chess | Zhemwel Dev",
  description: "Zhemwel Chess With Three.js",
  generator: "Zhemwel Dev",
  icons: {
    icon: "/favicon.ico",
  },
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
