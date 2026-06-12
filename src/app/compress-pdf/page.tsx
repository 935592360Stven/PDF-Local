"use client"
import { useState, useCallback } from "react"
import { Loader2, Download, FileDown } from "lucide-react"
import { posthog } from "@/components/PostHogProvider"
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

const levels = [
  { id: "low",    label: "Low",    desc: "Near lossless, ~20-40% reduction",       minRatio: 0.6, maxRatio: 0.8, scale: 1.5, quality: 0.88 },
  { id: "medium", label: "Medium", desc: "Good balance, ~40-70% reduction",         minRatio: 0.3, maxRatio: 0.6, scale: 1.0, quality: 0.6 },
  { id: "high",   label: "High",   desc: "Maximum compression, ~70-95% reduction",  minRatio: 0.05, maxRatio: 0.3, scale: 0.5, quality: 0.3 },
]

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(0)} KB`
  return `${(bytes/(1024*1024)).toFixed(1)} MB`
}

export default function CompressPDFPage() {
  const [files, setFiles] = useState<File[]>([]), [compressing, setCompressing] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [progress, setProgress] = useState(""), [orig, setOrig] = useState(0), [comp, setComp] = useState(0)
  const [level, setLevel] = useState("medium")
  const handleFiles = useCallback((f: File[]) => { setFiles(f); setBlob(null) }, [])

  const go = async () => {
    if (!files.length) return
    setCompressing(true); setProgress("Loading PDF…")
    try {
      const buf = await files[0].arrayBuffer(); setOrig(buf.byteLength)
      const lvl = levels.find(l => l.id === level)!

      setProgress("Loading PDF.js…")
      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise
      const n = pdf.numPages
      const { PDFDocument } = await import("pdf-lib")
      const outDoc = await PDFDocument.create()

      for (let i = 1; i <= n; i++) {
        setProgress(`Rendering page ${i} of ${n}…`)
        const page = await pdf.getPage(i)
        const vp = page.getViewport({ scale: lvl.scale })
        const c = document.createElement("canvas")
        c.width = vp.width; c.height = vp.height
        const ctx = c.getContext("2d")!
        await page.render({ canvasContext: ctx, viewport: vp }).promise

        const imgData = c.toDataURL("image/jpeg", lvl.quality)
        const img = await outDoc.embedJpg(imgData)
        const imgPage = outDoc.addPage([vp.width, vp.height])
        imgPage.drawImage(img, { x: 0, y: 0, width: vp.width, height: vp.height })
      }
      setProgress("Saving…")
      const out = await outDoc.save()
      const b = new Blob([out as BlobPart], { type: "application/pdf" })
      setComp(b.size); setBlob(b); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setCompressing(false) }
  }

  const dl = () => { if (!blob) return; posthog.capture("compress_download", { file_size: files[0]?.size }); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = `compressed-${files[0]?.name || "output.pdf"}`; a.click(); URL.revokeObjectURL(u) }
  const sv = orig && comp ? ((1 - comp / orig) * 100).toFixed(0) : "0"

  return (
    <ToolLayout title="Compress PDF" description="Reduce file size. Three levels to choose from." icon={<FileDown className="h-7 w-7 text-[#34c759]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".pdf" multiple={false} maxFiles={1} />

      {files.length > 0 && (
        <div className="mt-8">
          <label className="text-[14px] font-medium text-[#1d1d1f]">Compression Level</label>
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            {levels.map(l => {
              const estMin = files[0].size * l.minRatio
              const estMax = files[0].size * l.maxRatio
              return (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className={cn("rounded-[12px] border px-3 py-3 text-left transition-all",
                  level === l.id ? "border-[#34c759] bg-[#34c759]/5" : "border-[#e8e8ed] bg-white hover:border-[#d2d2d7]")}>
                <span className={cn("text-[13px] font-medium", level === l.id ? "text-[#1d1d1f]" : "text-[#1d1d1f]")}>{l.label}</span>
                <p className="mt-0.5 text-[11px] text-[#86868b]">{l.desc}</p>
                <p className="mt-1 text-[11px] text-[#34c759] font-medium">~{fmtSize(estMin)} – {fmtSize(estMax)}</p>
              </button>
              )
            })}
          </div>
          <p className="mt-2 text-[11px] text-[#c7c7cc]">Estimate based on file size. Actual results vary by content.</p>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-5">
        <button onClick={go} disabled={!files.length || compressing}
          className={cn("inline-flex items-center gap-2 rounded-xl px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            !files.length || compressing ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#34c759] hover:bg-[#2db84e]")}>
          {compressing && <Loader2 className="h-4 w-4 animate-spin" />}
          {compressing ? progress || "Compressing…" : !files.length ? "Upload a PDF file" : `Compress (${levels.find(l => l.id === level)!.label})`}
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f7] px-5 py-2 text-[14px] text-[#1d1d1f]">
              <span className="text-[#34c759]">✓</span>
              <span>{(orig / 1024).toFixed(0)} KB → {(comp / 1024).toFixed(0)} KB</span>
              <span className={cn("font-semibold", parseInt(sv) > 30 ? "text-[#34c759]" : "text-[#ff9500]")}>-{sv}%</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-xl bg-[#34c759] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#2db84e] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download compressed PDF
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-semibold text-[#1d1d1f]">How to compress a PDF</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF file</li>
          <li>Choose a compression level</li>
          <li>Click &ldquo;Compress&rdquo; and download — all levels re-render pages as images for guaranteed compression</li>
        </ol>
        <p className="mt-4 text-[12px] text-[#c7c7cc]">Compression converts text pages to images. Higher compression = smaller file, lower visual quality.</p>
      </div>
    </ToolLayout>
  )
}
