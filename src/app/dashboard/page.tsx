import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[780px] px-6 py-12 sm:px-8 sm:py-20">
      <div className="mb-10">
        <h1 className="text-[22px] font-semibold text-[#1d1d1f] sm:text-[28px]">Dashboard</h1>
        <p className="mt-1 text-[14px] text-[#86868b]">Free plan. <Link href="/pricing" className="text-[#007aff]">Upgrade to Pro</Link></p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { name: "PDFs Merged", count: 0, limit: 3 },
          { name: "PDFs Compressed", count: 0, limit: 5 },
          { name: "Rotations", count: 0, limit: "∞" },
          { name: "PDFs Split", count: 0, limit: 5 },
          { name: "JPG to PDF", count: 0, limit: "∞" },
          { name: "PDF to JPG", count: 0, limit: "∞" },
        ].map(s => (
          <div key={s.name} className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <p className="text-[13px] text-[#86868b]">{s.name}</p>
            <p className="mt-1 text-[20px] font-bold text-[#1d1d1f]">{s.count} <span className="text-[13px] font-normal text-[#c7c7cc]">/ {s.limit}</span></p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h2 className="text-[14px] font-medium text-[#1d1d1f]">Recent Activity</h2>
        <p className="mt-2 text-[13px] text-[#c7c7cc]">No recent activity yet.</p>
      </div>
    </div>
  )
}
