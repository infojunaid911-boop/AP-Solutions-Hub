import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AP Solutions Hub — Digital Solutions That Help Businesses Grow",
  description:
    "AP Solutions Hub builds websites, dashboards, digital marketing, branding, UI/UX and 3D visualization for businesses that want to look better, work smarter and grow faster.",
  openGraph: {
    title: "AP Solutions Hub",
    description:
      "Websites, dashboards, digital marketing, branding and 3D visualization — one creative and technology team.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
