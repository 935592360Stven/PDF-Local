"use client"
import { useState, useCallback, useMemo } from "react"
import { Loader2, Download, Crop } from "lucide-react"
import ToolLayout from "@/components/ToolLayout"
import FileUpload from "@/components/FileUpload"
import Slider from "@/components/Slider"
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

export default function CropPDFPage() {
  const [files, setFiles] = useState<File[]>([]), [processing, setProcessing] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [progress, setProgress] = useState("")
  const [totalPages, setTotalPages] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [rendering, setRendering] = useState(false)
  const [top, setTop] = useState(5)
  const [bottom, setBottom] = useState(5)
  const [left, setLeft] = useState(5)
  const [right, setRight] = useState(5)

  const handleFiles = useCallback(async (f: File[]) => {
    setFiles(f); setBlob(null); setPreview(null); setTotalPages(0); setTop(5); setBottom(5); setLeft(5); setRight(5)
    if (!f.length) return
    setRendering(true); setProgress("Loading PDF…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.load(await f[0].arrayBuffer())
      const n = doc.getPageCount()
      setTotalPages(n)
      setProgress("Rendering preview…")

      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: await f[0].arrayBuffer() }).promise
      const page = await pdf.getPage(1)
      const vp = page.getViewport({ scale: 0.5 })
      const c = document.createElement("canvas")
      c.width = vp.width; c.height = vp.height
      await page.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise
      setPreview(c.toDataURL("image/jpeg", 0.85))
      setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed to load"}`) }
    finally { setRendering(false) }
  }, [])

  const go = async () => {
    if (!files.length) return
    setProcessing(true); setProgress("Cropping…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.load(await files[0].arrayBuffer())
      doc.getPages().forEach(p => {
        const { width, height } = p.getSize()
        const l = (width * left) / 100
        const b = (height * bottom) / 100
        const r = (width * right) / 100
        const t = (height * top) / 100
        p.setCropBox(l, b, width - r, height - t)
        p.setMediaBox(l, b, width - r, height - t)
      })
      setProgress("Generating…")
      const bytes = await doc.save()
      setBlob(new Blob([bytes as BlobPart], { type: "application/pdf" })); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setProcessing(false) }
  }
  const dl = () => { if (!blob) return; const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = `cropped-${files[0]?.name || "output.pdf"}`; a.click(); URL.revokeObjectURL(u) }

  return (
    <ToolLayout title="Crop PDF" description="Remove unwanted margins from all pages." icon={<Crop className="h-7 w-7 text-[#5ac8fa]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".pdf" multiple={false} maxFiles={1} />

      {rendering && (
        <div className="mt-8 flex items-center justify-center gap-2 py-10 text-[15px] text-[#86868b]">
          <Loader2 className="h-4 w-4 animate-spin" />
          {progress || "Loading…"}
        </div>
      )}

      {preview && !rendering && (
        <div className="mt-8">
          <p className="text-[14px] font-medium text-[#1d1d1f]">{totalPages} page{totalPages > 1 ? "s" : ""} · Preview of page 1</p>

          {/* Preview with crop overlay */}
          <div className="relative mx-auto mt-4 max-w-[360px] overflow-hidden rounded-[12px] border border-[#e8e8ed] bg-[#f5f5f7]">
            <img src={preview} alt="Page preview" className="block w-full" />
            {/* Top crop overlay */}
            <div className="absolute left-0 right-0 bg-black/30" style={{ top: 0, height: `${top}%` }} />
            {/* Bottom crop overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/30" style={{ height: `${bottom}%` }} />
            {/* Left crop overlay (between top and bottom) */}
            <div className="absolute bg-black/30" style={{ top: `${top}%`, bottom: `${bottom}%`, left: 0, width: `${left}%` }} />
            {/* Right crop overlay (between top and bottom) */}
            <div className="absolute bg-black/30" style={{ top: `${top}%`, bottom: `${bottom}%`, right: 0, width: `${right}%` }} />
          </div>

          {/* Sliders */}
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
            {[
              { label: "Top", value: top, set: setTop, max: 40 },
              { label: "Bottom", value: bottom, set: setBottom, max: 40 },
              { label: "Left", value: left, set: setLeft, max: 40 },
              { label: "Right", value: right, set: setRight, max: 40 },
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[13px] font-medium text-[#1d1d1f]">{s.label}</label>
                  <span className="text-[12px] text-[#86868b]">{s.value}%</span>
                </div>
                <Slider min={0} max={s.max} value={s.value} onChange={s.set} accentColor="#5ac8fa" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        <button onClick={go} disabled={!files.length || processing || rendering}
          className={cn("inline-flex items-center gap-2 rounded-[12px] px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            !files.length || processing || rendering ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#5ac8fa] hover:bg-[#4db8e6]")}>
          {processing && <Loader2 className="h-4 w-4 animate-spin" />}
          {processing ? progress || "Cropping…" : !files.length ? "Upload a PDF file" : "Crop PDF"}
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#F2F2F7] px-5 py-2 text-[14px] text-[#6e6e73]">
              <span className="text-[#34c759]">✓</span>
              <span>Cropped — {(blob.size / 1024).toFixed(0)} KB</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-[12px] bg-[#5ac8fa] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#4db8e6] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-semibold text-[#1d1d1f]">How to crop a PDF</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF — the first page previews automatically</li>
          <li>Adjust the crop margins (Top, Bottom, Left, Right)</li>
          <li>Click &ldquo;Crop PDF&rdquo; and download — applied to all pages</li>
        </ol>
      </div>
    </ToolLayout>
  )
}
