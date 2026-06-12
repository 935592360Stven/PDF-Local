"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

const links = [
  { name: "Compress", href: "/compress-pdf" },
  { name: "Merge",    href: "/merge-pdf" },
  { name: "Split",    href: "/split-pdf" },
  { name: "Delete",   href: "/delete-pages" },
  { name: "Reorder",  href: "/reorder-pages" },
  { name: "Rotate",   href: "/rotate-pdf" },
  { name: "JPG→PDF",  href: "/jpg-to-pdf" },
  { name: "PDF→JPG",  href: "/pdf-to-jpg" },
  { name: "Extract",  href: "/extract-pages" },
  { name: "Page No.",  href: "/add-page-numbers" },
  { name: "Watermark", href: "/watermark-pdf" },
  { name: "Crop",     href: "/crop-pdf" },
]

const bottomLinks = [
  { name: "FAQ",     href: "/faq" },
  { name: "Privacy", href: "/privacy" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between px-5 lg:px-6">
        <Link href="/" className="mr-4 flex shrink-0 items-center gap-2 text-[14px] font-semibold text-[#1d1d1f]">
          <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none">
            <rect width="28" height="28" rx="7" fill="#007aff" />
            <path d="M8 5h7l4 4v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="white" />
            <path d="M15 5v4h4" fill="white" opacity="0.4" />
            <rect x="11" y="13" width="6" height="1.5" rx="0.75" fill="#007aff" opacity="0.2" />
            <rect x="11" y="16" width="4" height="1.5" rx="0.75" fill="#007aff" opacity="0.2" />
            <circle cx="22" cy="22" r="4" fill="#34c759" />
            <circle cx="22" cy="22" r="1.5" fill="white" />
          </svg>
          PDF Local
        </Link>

        <nav className="hidden items-center md:flex overflow-x-auto no-scrollbar">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="shrink-0 rounded-[8px] px-2 py-1.5 text-[12px] font-normal text-[#86868b] transition-colors hover:bg-[#f5f5f7] hover:text-[#1d1d1f] leading-none">
              {l.name}
            </Link>
          ))}
          <div className="mx-2 shrink-0 h-4 w-px bg-[#e8e8ed]" />
          {bottomLinks.map(l => (
            <Link key={l.href} href={l.href}
              className="shrink-0 rounded-[8px] px-2 py-1.5 text-[12px] font-normal text-[#86868b] transition-colors hover:bg-[#f5f5f7] hover:text-[#1d1d1f] leading-none">
              {l.name}
            </Link>
          ))}
        </nav>

        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] md:hidden hover:bg-[#f5f5f7]"
          onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <div className="flex flex-col gap-[3px]">
            <span className={cn("h-[1.5px] w-[18px] rounded-full bg-[#1d1d1f] transition-all", open && "translate-y-[4.5px] rotate-45")} />
            <span className={cn("h-[1.5px] w-[18px] rounded-full bg-[#1d1d1f] transition-all", open && "opacity-0")} />
            <span className={cn("h-[1.5px] w-[18px] rounded-full bg-[#1d1d1f] transition-all", open && "-translate-y-[4.5px] -rotate-45")} />
          </div>
        </button>
      </div>

      <div className={cn("overflow-hidden border-t border-[#e8e8ed] bg-white/60 backdrop-blur-2xl transition-all duration-200 md:hidden",
        open ? "max-h-[800px]" : "max-h-0 border-transparent")}>
        <div className="px-5 py-3 space-y-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block rounded-[8px] px-3 py-2 text-[15px] text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]">
              {l.name}
            </Link>
          ))}
          <div className="my-2 h-px bg-[#e8e8ed]" />
          {bottomLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block rounded-[8px] px-3 py-2 text-[15px] text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]">
              {l.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
