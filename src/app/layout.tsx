import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "WattWise", description: "Energy monitoring made simple" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
