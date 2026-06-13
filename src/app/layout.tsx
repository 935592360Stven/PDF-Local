import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { PostHogProvider } from "@/components/PostHogProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PDF Local - Private Browser-Based PDF Tools | Merge, Compress, Convert",
  description:
    "Free online PDF tools that run in your browser. Merge, compress, split, rotate, and delete PDF pages — your files never leave your device.",
  keywords:
    "pdf merger, pdf compressor, jpg to pdf, split pdf, pdf to jpg, free pdf tools, online pdf editor, private pdf tools, local pdf tools",
  verification: {
    google: "google9ed3c94c6439864c",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  )
}
