import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JPG to PDF Converter – Free Online Tool | PDF Local",
  description:
    "Convert JPG, PNG, and other images to PDF documents right in your browser. Combine multiple images into a single PDF. No uploads, no sign-up.",
  alternates: { canonical: "https://pdf-local.pages.dev/jpg-to-pdf" },
  openGraph: {
    title: "JPG to PDF – Free Online Converter | PDF Local",
    description: "Turn images into PDF documents without uploading files.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
