import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add Watermark to PDF – Free Online Tool | PDF Local",
  description:
    "Add text watermarks to every page of your PDF. Customize opacity, position, and rotation. Free, private, runs entirely in your browser.",
  alternates: { canonical: "https://pdf-local.pages.dev/watermark-pdf" },
  openGraph: {
    title: "Add Watermark to PDF – Free Online | PDF Local",
    description: "Add text watermarks to PDFs locally in your browser.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
