import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e8ed]">
      <div className="mx-auto max-w-[1060px] px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-1.5 text-[13px] text-[#86868b]">
            <svg viewBox="0 0 28 28" className="h-5 w-5" fill="none">
              <rect width="28" height="28" rx="7" fill="#007aff" />
              <path d="M8 5h7l4 4v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="white" />
              <rect x="11" y="13" width="6" height="1.5" rx="0.75" fill="#007aff" opacity="0.2" />
              <rect x="11" y="16" width="4" height="1.5" rx="0.75" fill="#007aff" opacity="0.2" />
              <circle cx="22" cy="22" r="4" fill="#34c759" />
              <circle cx="22" cy="22" r="1.5" fill="white" />
            </svg>
            PDF Local
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[#86868b]">
            <Link href="/faq" className="hover:text-[#1d1d1f] transition-colors">FAQ</Link>
            <Link href="/privacy" className="hover:text-[#1d1d1f] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#1d1d1f] transition-colors">Terms</Link>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
