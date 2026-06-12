"use client"

import { useState, useRef, type DragEvent } from "react"
import { Upload, File, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSizeMB?: number
}

export default function FileUpload({
  onFilesSelected,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 50,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isFull = files.length >= maxFiles

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isFull) setIsDragging(e.type === "dragenter" || e.type === "dragover")
  }

  const validateAndAdd = (newFiles: File[]) => {
    setError(null)
    const combined = [...files, ...newFiles]
    if (combined.length > maxFiles) {
      setError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`)
      return
    }
    for (const f of newFiles) {
      if (f.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${f.name}" exceeds ${maxSizeMB}MB limit`)
        return
      }
    }
    setFiles(combined)
    onFilesSelected(combined)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!isFull) validateAndAdd(Array.from(e.dataTransfer.files))
  }

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isFull) validateAndAdd(Array.from(e.target.files || []))
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesSelected(updated)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full">
      {!isFull ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 px-8 transition-all",
            isDragging
              ? "border-[#007aff] bg-[#007aff]/5"
              : "border-[#e8e8ed] hover:border-[#007aff]/50 hover:bg-[#f5f5f7]"
          )}
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f7]">
            <Upload className="h-6 w-6 text-[#86868b]" />
          </div>
          <p className="text-[16px] font-medium text-[#1d1d1f]">
            Drag & drop or <span className="text-[#007aff]">browse</span>
          </p>
          <p className="mt-1.5 text-[14px] text-[#86868b]">
            PDF, JPG, PNG — Up to {maxSizeMB}MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="mb-5 flex items-center justify-between rounded-2xl border-2 border-dashed border-[#e8e8ed] py-5 px-6 bg-[#fafafa]">
          <p className="text-[15px] text-[#86868b]">
            {maxFiles === 1 ? "File added" : `Maximum ${maxFiles} files`}
          </p>
          <p className="text-[13px] text-[#c7c7cc]">
            {maxFiles === 1 ? "Remove to upload a different file" : "Remove files to add more"}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-[14px] text-[#ff2d55]">{error}</p>
      )}

      {files.length > 0 && (
        <div className={cn("space-y-2", !isFull && "mt-5")}>
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[#86868b]">{files.length} file{files.length > 1 ? "s" : ""}</p>
            {files.length > 1 && (
              <button onClick={() => { setFiles([]); onFilesSelected([]) }}
                className="text-[12px] text-[#ff2d55] hover:underline">
                Clear all
              </button>
            )}
          </div>
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-xl border border-[#e8e8ed] bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3 truncate">
                <File className="h-4 w-4 shrink-0 text-[#007aff]" />
                <span className="truncate text-[14px] text-[#1d1d1f]">{file.name}</span>
                <span className="shrink-0 text-[13px] text-[#8E8E93]">({formatSize(file.size)})</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#c7c7cc] hover:bg-[#f5f5f7] hover:text-[#ff2d55]"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </div>
      )}
    </div>
  )
}
