import type { ReactNode } from "react"

interface Props {
  title: string
  description: string
  icon: ReactNode
  children: ReactNode
}

export default function ToolLayout({ title, description, icon, children }: Props) {
  return (
    <div className="mx-auto max-w-[780px] px-6 py-12 sm:px-8 sm:py-20">
      <div className="mb-14 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#f5f5f7]">
          {icon}
        </div>
        <h1 className="text-[36px] font-semibold leading-[1.1] text-[#1d1d1f] sm:text-[44px]">{title}</h1>
        <p className="mx-auto mt-3 max-w-[460px] text-[17px] leading-[1.5] text-[#6e6e73]">{description}</p>
      </div>
      <div className="rounded-[16px] bg-white p-8 shadow-[0_4px_16px_rgba(0,0,0,0.06)] sm:p-10">
        {children}
      </div>
    </div>
  )
}
