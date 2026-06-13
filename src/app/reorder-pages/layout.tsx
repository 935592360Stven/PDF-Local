import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reorder PDF Pages Online – Drag & Drop | PDF Local",
  description:
    "Rearrange PDF pages by dragging them into the order you want. Free browser-based tool. No uploads, no sign-up required.",
  alternates: { canonical: "https://pdf-local.pages.dev/reorder-pages" },
  openGraph: {
    title: "Reorder PDF Pages – Free Online Tool | PDF Local",
    description: "Rearrange PDF pages with drag and drop, directly in your browser.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
