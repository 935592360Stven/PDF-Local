import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delete Pages from PDF Online for Free – Remove Unwanted Pages | PDF Local",
  description:
    "Remove unwanted pages from your PDF file right in your browser. Select pages to delete and download the result. No uploads, no servers, 100% free.",
  alternates: { canonical: "https://pdf-local.pages.dev/delete-pages" },
  openGraph: {
    title: "Delete Pages from PDF – Free Online Tool | PDF Local",
    description: "Remove unwanted PDF pages without uploading files.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
