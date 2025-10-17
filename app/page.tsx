"use client"

import { useState } from "react"
import Header from "@/components/header"
import Home from "@/components/home"
import ImageCaptionGenerator from "@/components/image-caption-generator"
import QuizGenerator from "@/components/quiz-generator"

export default function Page() {
  const [currentPage, setCurrentPage] = useState<"home" | "caption" | "quiz">("home")

  const renderPage = () => {
    switch (currentPage) {
      case "caption":
        return <ImageCaptionGenerator onBack={() => setCurrentPage("home")} />
      case "quiz":
        return <QuizGenerator onBack={() => setCurrentPage("home")} />
      default:
        return <Home onNavigate={setCurrentPage} />
    }
  }

  return (
    <main className="min-h-screen relative">
      <div className="relative z-10">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="animate-fade-in">{renderPage()}</div>
      </div>
    </main>
  )
}
