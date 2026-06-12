"use client"
import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  { name: "Free", price: "$0", period: "forever", desc: "For occasional use",
    features: ["All 6 PDF tools", "3 merges per day", "5 MB file size limit", "100% in-browser processing"],
    cta: "Get started", href: "/", popular: false },
  { name: "Pro", price: "$9", period: "/month", desc: "For regular users & professionals",
    features: ["Unlimited file processing", "50 MB file size limit", "AI-powered compression", "PDF Summarizer & AI Chat", "Batch processing", "Priority email support"],
    cta: "Subscribe", lemonSqueezyId: "pro-monthly", popular: true },
  { name: "Pro Yearly", price: "$99", period: "/year", desc: "Best value — save $9",
    features: ["Everything in Pro", "100 MB file size limit", "Advanced AI features", "API access (coming soon)"],
    cta: "Subscribe", lemonSqueezyId: "pro-yearly", badge: "Best Value", popular: false },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const sub = async (id: string) => { setLoading(id); await new Promise(r => setTimeout(r, 1200)); setLoading(null); alert("LemonSqueezy coming soon!") }

  return (
    <div className="mx-auto max-w-[1060px] px-6 lg:px-8 py-20 sm:py-28">
      <div className="mb-16 text-center">
        <h1 className="text-[36px] font-semibold leading-[1.1] text-[#1d1d1f] sm:text-[44px]">Simple, Transparent Pricing</h1>
        <p className="mt-3 text-[17px] text-[#6e6e73]">Start free. Upgrade when you need more.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-3 items-start">
        {plans.map(p => (
          <div key={p.name} className={cn("relative flex flex-col rounded-[16px] bg-white p-8 shadow-[0_4px_16px_rgba(0,0,0,0.06)]",
            p.popular && "shadow-[0_4px_20px_rgba(0,122,255,0.12)]")}>
            {p.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#007aff] px-4 py-1 text-[11px] font-semibold text-white">{p.badge}</div>}
            <div className="mb-6">
              <h2 className="text-[16px] font-medium text-[#1d1d1f]">{p.name}</h2>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[36px] font-bold leading-none text-[#1d1d1f]">{p.price}</span>
                <span className="text-[14px] text-[#86868b]">{p.period}</span>
              </div>
              <p className="mt-1.5 text-[14px] text-[#86868b]">{p.desc}</p>
            </div>
            <ul className="mb-8 flex-1 space-y-3.5">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#86868b]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34c759]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => { if (p.lemonSqueezyId) sub(p.lemonSqueezyId); else window.location.href = p.href! }}
              disabled={loading === p.lemonSqueezyId}
              className={cn("inline-flex items-center justify-center rounded-[12px] px-5 py-2.5 text-[14px] font-medium transition-all active:scale-[0.97]",
                p.popular ? "bg-[#007aff] text-white hover:bg-[#0066cc]" : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]")}>
              {loading === p.lemonSqueezyId ? <Loader2 className="h-4 w-4 animate-spin" /> : p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
