import Link from "next/link"
import { Combine, FileDown, RotateCw, Scissors, FileImage, ImageDown, Trash2, Pen, ListOrdered, Scan, Shuffle, Crop } from "lucide-react"

const tools = [
  // Row 1: Highest frequency
  { title: "Compress PDF", desc: "Reduce file size without sacrificing quality.", href: "/compress-pdf", icon: FileDown, color: "#34c759", grad: "from-[#34c759]/10 to-[#30d158]/10" },
  { title: "Merge PDF",    desc: "Combine multiple PDFs into one document.",      href: "/merge-pdf",    icon: Combine,   color: "#007aff", grad: "from-[#007aff]/10 to-[#5ac8fa]/10" },
  { title: "Split PDF",    desc: "Split into multiple files by page count.",      href: "/split-pdf",    icon: Scissors,  color: "#af52de", grad: "from-[#af52de]/10 to-[#5ac8fa]/10" },
  // Row 2: Page organization
  { title: "Delete Pages", desc: "Remove unwanted pages from your PDF.",          href: "/delete-pages", icon: Trash2,    color: "#ff2d55", grad: "from-[#ff2d55]/10 to-[#ff9500]/10" },
  { title: "Reorder Pages",desc: "Rearrange pages by dragging them.",             href: "/reorder-pages",icon: Shuffle,   color: "#ff9500", grad: "from-[#ff9500]/10 to-[#ffcc00]/10" },
  { title: "Rotate PDF",   desc: "Rotate pages by 90°, 180°, or 270°.",          href: "/rotate-pdf",   icon: RotateCw,  color: "#5ac8fa", grad: "from-[#5ac8fa]/10 to-[#007aff]/10" },
  // Row 3: Conversion
  { title: "JPG to PDF",   desc: "Turn images into a polished PDF document.",     href: "/jpg-to-pdf",   icon: FileImage, color: "#ff9500", grad: "from-[#ff9500]/10 to-[#ffcc00]/10" },
  { title: "PDF to JPG",   desc: "Convert each page into a high-quality image.",  href: "/pdf-to-jpg",   icon: ImageDown, color: "#ff2d55", grad: "from-[#ff2d55]/10 to-[#ff9500]/10" },
  { title: "Extract Pages",desc: "Pick specific pages and extract into a new PDF.",href: "/extract-pages",icon: Scan,      color: "#34c759", grad: "from-[#34c759]/10 to-[#30d158]/10" },
  // Row 4: Low frequency
  { title: "Add Page No.", desc: "Add page numbers to every page.",               href: "/add-page-numbers", icon: ListOrdered, color: "#af52de", grad: "from-[#af52de]/10 to-[#5ac8fa]/10" },
  { title: "Watermark PDF",desc: "Add text watermark to every page.",             href: "/watermark-pdf",icon: Pen,        color: "#5ac8fa", grad: "from-[#5ac8fa]/10 to-[#007aff]/10" },
  { title: "Crop PDF",     desc: "Remove unwanted margins from your pages.",      href: "/crop-pdf",     icon: Crop,      color: "#5ac8fa", grad: "from-[#5ac8fa]/10 to-[#007aff]/10" },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1060px] px-6 lg:px-8 pt-28 sm:pt-36 pb-24 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e8ed] bg-white px-4 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <span className="h-2 w-2 rounded-full bg-[#34c759]" />
            <span className="text-[13px] text-[#86868b]">Private PDF tools — processed locally in your browser</span>
          </div>
          <h1 className="mt-10 text-[48px] font-semibold leading-[1.06] tracking-[-0.003em] text-[#1d1d1f] sm:text-[56px]">
            Private PDF Tools
            <br />
            That Run in Your Browser.
          </h1>
          <p className="mx-auto mt-5 max-w-[540px] text-[17px] leading-[1.5] text-[#6e6e73]">
            Merge, split, compress, rotate, and delete pages without uploading your files.
            Everything stays on your device.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link href="/merge-pdf"
              className="inline-flex items-center justify-center rounded-[12px] bg-[#007aff] px-7 py-3 text-[15px] font-medium text-white transition-all hover:bg-[#0066cc] active:scale-[0.97]">
              Try Merge PDF
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1060px] px-6 lg:px-8 pt-24 sm:pt-28 pb-28 sm:pb-36">
          <div className="mb-16 text-center">
            <h2 className="text-[28px] font-semibold leading-[1.2] text-[#1d1d1f] sm:text-[32px]">Everything you need</h2>
            <p className="mt-3 text-[16px] leading-[1.5] text-[#6e6e73]">Twelve tools for all your PDF tasks.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(t => (
              <Link key={t.href} href={t.href}
                className="group rounded-[16px] bg-white p-7 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)] hover:-translate-y-1">
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-[12px] bg-gradient-to-br ${t.grad}`}>
                  <t.icon className="h-5 w-5" strokeWidth={1.5} style={{ color: t.color }} />
                </div>
                <h3 className="text-[15px] font-medium text-[#1d1d1f]">{t.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#6e6e73]">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1060px] px-6 lg:px-8 py-24 sm:py-28">
          <h2 className="text-[28px] font-semibold leading-[1.2] text-[#1d1d1f] sm:text-[32px]">Why PDF Local?</h2>
          <div className="mt-12 grid gap-12 sm:grid-cols-3">
            {[
              { title: "100% Private", desc: "Your files never leave your device. Everything is processed in your browser — nothing is uploaded." },
              { title: "Instantly Fast", desc: "No queues or waiting. Since everything runs locally, your files are processed immediately." },
              { title: "Works Everywhere", desc: "No downloads or installs. Works on any modern browser — Mac, Windows, iPad, or iPhone." },
            ].map(f => (
              <div key={f.title}>
                <h3 className="text-[16px] font-semibold text-[#1d1d1f]">{f.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#6e6e73]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
