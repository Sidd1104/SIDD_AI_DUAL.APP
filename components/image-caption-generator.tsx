"use client"

import type React from "react"
import { useState, useRef } from "react"

interface ImageCaptionGeneratorProps {
  onBack: () => void
}

export default function ImageCaptionGenerator({ onBack }: ImageCaptionGeneratorProps) {
  const [image, setImage] = useState<string | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setCaption("")
        setError("")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNewUpload = () => {
    setImage(null)
    setCaption("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const generateCaption = async () => {
    if (!image) {
      setError("Please upload an image first")
      return
    }

    setLoading(true)
    setError("")
    try {
      const base64Image = image.split(",")[1]
      const mimeType = image.split(";")[0].split(":")[1]

      console.log("[v0] Sending caption generation request")

      const response = await fetch("/api/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: mimeType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] API error response:", data)
        setError(data.error || "Failed to generate caption. Please try again.")
        return
      }

      if (!data.caption) {
        console.error("[v0] No caption in response:", data)
        setError("No caption found in response. Please try again.")
        return
      }

      console.log("[v0] Caption generated successfully")
      setCaption(data.caption)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error("[v0] Caption generation error:", errorMessage)
      setError(`Error: ${errorMessage}. Please check your API configuration.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 px-4 py-2 text-red-300 hover:text-red-100 transition-colors flex items-center gap-2 group hover:scale-105 hover:-translate-x-1 duration-300"
        >
          <span className="inline-block group-hover:-translate-x-1 transition-transform duration-300">←</span>
          Back to Home
        </button>

        <div className="space-y-8 animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
              Image Caption Generator
            </h1>
            <p className="text-red-200/70">Upload an image and let AI create the perfect caption</p>
          </div>

          <div className="space-y-6">
            {/* Upload Section */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full rounded-xl border-2 border-dashed border-red-500/50 hover:border-red-400 transition-colors cursor-pointer bg-red-500/5 flex items-center justify-center group overflow-hidden"
                style={{ minHeight: image ? "auto" : "256px" }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {image ? (
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Uploaded"
                    className="w-full max-h-[600px] object-contain p-4"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-red-200 font-medium">Click to upload image</p>
                    <p className="text-red-200/50 text-sm">or drag and drop</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generateCaption}
                  disabled={!image || loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-red-500/50 hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">{loading ? "Generating Caption..." : "Generate Caption"}</span>
                </button>

                {image && (
                  <button
                    onClick={handleNewUpload}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-102 transition-all relative overflow-hidden group animate-fade-in"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">New Upload</span>
                  </button>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="rounded-xl bg-slate-900/50 border border-red-500/20 p-6 min-h-40">
                {error && <div className="text-red-400 text-center text-sm">{error}</div>}
                {caption && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-red-200/60 text-sm font-medium">Generated Caption:</p>
                    <p className="text-white text-lg leading-relaxed">{caption}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(caption)
                      }}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/40 hover:to-orange-500/40 text-red-300 rounded-lg transition-all text-sm font-medium hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
                    >
                      Copy Caption
                    </button>
                  </div>
                )}
                {!caption && !error && (
                  <p className="text-red-200/40 text-center">Your generated caption will appear here</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
