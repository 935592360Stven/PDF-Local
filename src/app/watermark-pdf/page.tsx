"use client"
import { useState, useCallback } from "react"
import { Loader2, Download, Pen } from "lucide-react"
import ToolLayout from "@/components/ToolLayout"
import FileUpload from "@/components/FileUpload"
import { cn } from "@/lib/utils"

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

function loadPdfJs(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) return resolve((window as any).pdfjsLib)
    const s = document.createElement("script")
    s.src = PDFJS_CDN
    s.onload = () => { (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER; resolve((window as any).pdfjsLib) }
    s.onerror = () => reject(new Error("Failed to load PDF.js"))
    document.head.appendChild(s)
  })
}

const styles = [
  { id: "diagonal", label: "Single Diagonal", desc: "Large text across center, 45° rotated" },
  { id: "tiled",    label: "Tiled",           desc: "Repeated text covering the full page" },
  { id: "banner",   label: "Horizontal",       desc: "Repeated text as horizontal stripes" },
]

function PreviewBox({ styleId, text: wmText }: { styleId: string; text: string }) {
  const txt = wmText || "DRAFT"
  return (
    <div className="relative mb-2.5 flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-[6px] bg-[#fafafa]">
      {styleId === "diagonal" && (
        <span className="text-[28px] font-bold tracking-[0.08em] text-[#d2d2d7] select-none whitespace-nowrap"
          style={{ transform: "rotate(35deg)" }}>
          {txt}
        </span>
      )}
      {styleId === "tiled" && (
        <div className="absolute inset-0 grid grid-cols-5 grid-rows-7 overflow-hidden"
          style={{ transform: "rotate(35deg) scale(1.3)" }}>
          {Array.from({ length: 35 }).map((_, i) => (
            <span key={i} className="flex items-center justify-center font-bold text-[#d2d2d7] text-[6px]">
              {txt}
            </span>
          ))}
        </div>
      )}
      {styleId === "banner" && (
        <div className="absolute inset-0 flex flex-col justify-evenly overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-around px-0 overflow-hidden">
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} className="text-[8px] font-bold tracking-[0.04em] text-[#d2d2d7] shrink-0">
                  {txt}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function WatermarkPDFPage() {
  const [files, setFiles] = useState<File[]>([]), [processing, setProcessing] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [progress, setProgress] = useState("")
  const [text, setText] = useState("DRAFT"), [style, setStyle] = useState("diagonal")
  const [totalPages, setTotalPages] = useState(0)
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [rendering, setRendering] = useState(false)

  const handleFiles = useCallback(async (f: File[]) => {
    setFiles(f); setBlob(null); setSelectedPages(new Set()); setThumbnails([]); setTotalPages(0)
    if (!f.length) return
    setRendering(true); setProgress("Loading PDF…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.load(await f[0].arrayBuffer())
      const n = doc.getPageCount()
      setTotalPages(n)
      const all = new Set<number>()
      for (let i = 1; i <= n; i++) all.add(i)
      setSelectedPages(all)
      setProgress("Rendering previews…")
      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: await f[0].arrayBuffer() }).promise
      const thumbs: string[] = []
      const maxPages = Math.min(n, 50)
      for (let i = 1; i <= maxPages; i++) {
        setProgress(`Rendering page ${i} of ${maxPages}…`)
        const pg = await pdf.getPage(i)
        const vp = pg.getViewport({ scale: 0.3 })
        const c = document.createElement("canvas")
        c.width = vp.width; c.height = vp.height
        await pg.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise
        thumbs.push(c.toDataURL("image/jpeg", 0.6))
      }
      setThumbnails(thumbs)
      setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed to load"}`) }
    finally { setRendering(false) }
  }, [])

  const togglePage = (n: number) => {
    setSelectedPages(prev => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n); else next.add(n)
      return next
    })
  }

  const selectAll = () => {
    const all = new Set<number>()
    for (let i = 1; i <= totalPages; i++) all.add(i)
    setSelectedPages(all)
  }

  const clearAll = () => setSelectedPages(new Set())

  const go = async () => {
    if (!files.length || !text || !selectedPages.size) return
    setProcessing(true); setProgress("Adding watermark…")
    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib")
      const doc = await PDFDocument.load(await files[0].arrayBuffer())
      const font = await doc.embedFont(StandardFonts.HelveticaBold)
      const pages = doc.getPages()

      for (let i = 0; i < pages.length; i++) {
        const pn = i + 1
        if (!selectedPages.has(pn)) continue
        setProgress(`Watermarking page ${pn} of ${pages.length}…`)
        const page = pages[i], { width, height } = page.getSize()

        if (style === "diagonal") {
          const s = Math.min(width, height) / 8
          // Helvetica Bold avg char width ≈ 0.5s, text height above baseline ≈ 0.35s
          const tw = text.length * s * 0.5
          const sh = s * 0.35
          // After -45°: visual center offset = (0.707*(tw/2+sh), 0.707*(sh-tw/2))
          const cx = 0.707 * (tw / 2 + sh)
          const cy = 0.707 * (tw / 2 - sh)
          page.drawText(text, {
            x: width / 2 - cx,
            y: height / 2 + cy,
            size: s, font,
            color: rgb(0.75, 0.75, 0.75),
            opacity: 0.3,
            rotate: degrees(-45),
          })
        } else if (style === "tiled") {
          const s = Math.min(width, height) / 16
          const stepX = text.length * s * 0.92
          const stepY = s * 3.5
          for (let x = -stepX; x < width + stepX; x += stepX) {
            for (let y = -stepY; y < height + stepY; y += stepY) {
              page.drawText(text, { x, y, size: s, font,
                color: rgb(0.75, 0.75, 0.75),
                opacity: 0.2,
                rotate: degrees(-45),
              })
            }
          }
        } else if (style === "banner") {
          const s = Math.min(width, height) / 14
          const stepX = text.length * s * 0.75
          const nX = Math.ceil(width / stepX) + 2
          const startX = -stepX + (width - (nX - 2) * stepX) / 2
          for (let row = 0; row < 3; row++) {
            const y = height * (0.15 + row * 0.35)
            for (let i = 0; i < nX; i++) {
              const x = startX + i * stepX
              page.drawText(text, { x, y, size: s, font,
                color: rgb(0.75, 0.75, 0.75),
                opacity: 0.25,
                rotate: degrees(0),
              })
            }
          }
        }
      }
      setProgress("Generating…")
      const out = await doc.save()
      setBlob(new Blob([out as BlobPart], { type: "application/pdf" })); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setProcessing(false) }
  }
  const dl = () => { if (!blob) return; const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = `watermarked-${files[0]?.name || "output.pdf"}`; a.click(); URL.revokeObjectURL(u) }

  const disabled = files.length === 0

  return (
    <ToolLayout title="Watermark PDF" description="Add text watermark to every page of your PDF." icon={<Pen className="h-7 w-7 text-[#5ac8fa]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".pdf" multiple={false} maxFiles={1} />

      <div className="mt-8">
        <label className="text-[14px] font-medium text-[#1d1d1f]">Watermark Text</label>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE…"
          className={cn("mt-2 w-full rounded-[12px] border bg-white px-4 py-2.5 text-[15px] text-[#1d1d1f] outline-none transition-all placeholder:text-[#c7c7cc]",
            !disabled ? "border-[#e8e8ed] focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/20" : "border-[#e8e8ed]/60 text-[#c7c7cc]")} />
      </div>

      <div className="mt-6">
        <label className="text-[14px] font-medium text-[#1d1d1f]">Style</label>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {styles.map(s => (
            <button key={s.id} onClick={() => !disabled && setStyle(s.id)}
              className={cn("rounded-[12px] border p-3 text-left transition-all",
                disabled && "opacity-50 cursor-default",
                style === s.id && !disabled ? "border-[#007aff] bg-[#007aff]/5" : "border-[#e8e8ed]",
                style !== s.id && !disabled && "bg-white hover:border-[#d2d2d7]")}>
              <PreviewBox styleId={s.id} text={text} />
              <span className={cn("text-[13px] font-medium", !disabled ? "text-[#1d1d1f]" : "text-[#c7c7cc]")}>{s.label}</span>
              <p className="mt-0.5 text-[11px] text-[#86868b]">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {rendering && (
        <div className="mt-6 flex items-center justify-center gap-2 py-6 text-[15px] text-[#86868b]">
          <Loader2 className="h-4 w-4 animate-spin" />
          {progress || "Loading…"}
        </div>
      )}

      {totalPages > 0 && !rendering && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-[#1d1d1f]">
              Pages to watermark: {selectedPages.size} of {totalPages}
            </p>
            <div className="flex gap-3">
              <button onClick={selectAll} className="text-[12px] text-[#007aff] hover:underline">All</button>
              <button onClick={clearAll} className="text-[12px] text-[#86868b] hover:underline">None</button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
              const sel = selectedPages.has(n)
              const ht = thumbnails[n - 1]
              return (
                <button key={n} onClick={() => togglePage(n)}
                  className={cn("group relative aspect-[3/4] overflow-hidden rounded-[12px] border-2 transition-all",
                    sel ? "border-[#007aff] bg-[#007aff]/5" : "border-[#e8e8ed] bg-white hover:border-[#d2d2d7]")}>
                  {ht ? <img src={ht} alt={`Page ${n}`} className="h-full w-full object-cover" /> :
                    <div className="flex h-full w-full items-center justify-center bg-[#f5f5f7] text-[14px] text-[#c7c7cc]">Page {n}</div>}
                  {sel && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#007aff]/10">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#007aff] text-[10px] font-bold text-white shadow-md">✓</div>
                    </div>
                  )}
                  <div className={cn("absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                    sel ? "bg-[#007aff] text-white" : "bg-black/50 text-white")}>{n}</div>
                  {totalPages > 50 && n === 50 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-[13px] text-[#86868b]">+ {totalPages - 50} more</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-5">
        <button onClick={go} disabled={!files.length || !text || !selectedPages.size || processing || rendering}
          className={cn("inline-flex items-center gap-2 rounded-[12px] px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            !files.length || !text || !selectedPages.size || processing || rendering ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#007aff] hover:bg-[#0066cc]")}>
          {processing && <Loader2 className="h-4 w-4 animate-spin" />}
          {processing ? progress || "Adding watermark…" : !files.length ? "Upload a PDF" : !text ? "Enter text" : !selectedPages.size ? "Select pages" : `Watermark ${selectedPages.size} page${selectedPages.size > 1 ? "s" : ""}`}
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f7] px-5 py-2 text-[14px] text-[#1d1d1f]">
              <span className="text-[#34c759]">✓</span>
              <span>Watermarked — {(blob.size / 1024).toFixed(0)} KB</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-[12px] bg-[#007aff] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#0066cc] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
