import type { MetadataRoute } from "next"

const baseUrl = "https://pdf-local.pages.dev"

const tools = [
  "/compress-pdf",
  "/merge-pdf",
  "/split-pdf",
  "/delete-pages",
  "/reorder-pages",
  "/rotate-pdf",
  "/jpg-to-pdf",
  "/pdf-to-jpg",
  "/extract-pages",
  "/add-page-numbers",
  "/watermark-pdf",
  "/crop-pdf",
]

const guides = [
  "/compress-pdf-to-size",
  "/delete-pdf-pages-online",
  "/merge-pdf-files-privately",
]

const info = [
  "/faq",
  "/privacy",
  "/terms",
]

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const all = [...tools, ...guides, ...info]

  return all.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-06-12"),
    changeFrequency: "weekly" as const,
    priority: path === "/compress-pdf" ? 1.0 : path.startsWith("/") && tools.includes(path) ? 0.9 : 0.7,
  }))
}
