import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online for Free – 90°, 180°, 270° | PDF Local",
  description:
    "Rotate individual PDF pages or the entire document. Choose from 90°, 180°, or 270° rotation. Free, private, works entirely in your browser.",
  alternates: { canonical: "https://pdf-local.pages.dev/rotate-pdf" },
  openGraph: {
    title: "Rotate PDF Pages – Free Online Tool | PDF Local",
    description: "Rotate PDF pages 90°, 180°, or 270° directly in your browser.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
