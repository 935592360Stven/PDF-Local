"use client"
import { useCallback, useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  accentColor?: string
  className?: string
}

export default function Slider({ min, max, value, onChange, accentColor = "#007aff", className }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const pct = ((value - min) / (max - min)) * 100

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const ratio = x / rect.width
    onChange(Math.round(min + ratio * (max - min)))
  }, [min, max, onChange])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updateValue(e.clientX)
  }, [updateValue])

  useEffect(() => {
    if (!dragging) return
    const handleMove = (e: PointerEvent) => { updateValue(e.clientX) }
    const handleUp = () => { setDragging(false) }
    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
    }
  }, [dragging, updateValue])

  return (
    <div
      ref={trackRef}
      className={cn("relative h-[6px] rounded-full bg-[#e8e8ed] cursor-pointer select-none", className)}
      onPointerDown={handlePointerDown}
      style={{ touchAction: "none" }}>
      {/* Filled track */}
      <div className="h-full rounded-full pointer-events-none transition-[width] duration-[50ms]"
        style={{ width: `${pct}%`, backgroundColor: accentColor }} />
      {/* Capsule thumb — always visible */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none
          h-[18px] min-w-[10px] px-[5px] rounded-[9px]
          flex items-center justify-center
          backdrop-blur-xl bg-white/70 shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
        style={{ left: `${pct}%`, border: `1.5px solid ${accentColor}40` }}>
        <div className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: accentColor }} />
      </div>
    </div>
  )
}