"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "Are my files uploaded to any server?",
    a: "No. All PDF processing happens entirely in your browser. Your files never leave your device. Once you close the page, nothing is stored anywhere.",
  },
  {
    q: "Is there a file size limit?",
    a: "There is no artificial limit — the only constraint is your browser's memory. Very large files (500MB+) may cause performance issues depending on your device.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. PDF Local is completely free and requires no sign-up or registration.",
  },
  {
    q: "Do you save or store my PDFs?",
    a: "No. We cannot access your files because they never reach our servers. Your documents are processed and stay on your device.",
  },
  {
    q: "Which browsers are supported?",
    a: "PDF Local works on all modern browsers: Chrome, Firefox, Safari, and Edge. Internet Explorer is not supported.",
  },
  {
    q: "Can I use PDF Local on my phone or tablet?",
    a: "Yes. The tools are responsive and work on mobile browsers, though very large files may be slower on mobile devices.",
  },
  {
    q: "What tools are available?",
    a: "Currently we offer: Merge PDF, Split PDF, Compress PDF, Delete Pages, Reorder Pages, Rotate PDF, JPG to PDF, PDF to JPG, Extract Pages, Add Page Numbers, Watermark PDF, and Crop PDF.",
  },
  {
    q: "Is PDF Local open source?",
    a: "The core processing libraries (PDF.js, pdf-lib) are open source. Our website code is available on GitHub.",
  },
  {
    q: "Will you add more tools?",
    a: "We plan to add more features over time. If you have a specific tool in mind, let us know on GitHub.",
  },
]

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-[720px] px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-[28px] font-semibold leading-[1.2] text-[#1d1d1f] sm:text-[32px]">Frequently Asked Questions</h1>
      <p className="mt-2 text-[15px] text-[#6e6e73]">Everything you need to know about PDF Local.</p>

      <div className="mt-10 divide-y divide-[#e8e8ed] border-y border-[#e8e8ed]">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="flex w-full items-center justify-between py-4 text-left text-[15px] font-medium text-[#1d1d1f] transition-colors hover:text-[#007aff]">
              <span>{faq.q}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#c7c7cc] transition-transform duration-200",
                openIdx === i && "rotate-180")} />
            </button>
            <div className={cn("overflow-hidden transition-all duration-200",
              openIdx === i ? "pb-4" : "max-h-0")}>
              <p className="text-[14px] leading-[1.7] text-[#6e6e73]">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
