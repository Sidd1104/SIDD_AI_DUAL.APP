"use client"

import ToolCard from "./tool-card"

interface HomeProps {
  onNavigate: (page: "caption" | "quiz") => void
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/15 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl sm:text-6xl lg:text-7xl animate-bounce">⚡</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent">
              SIDD AI DUAL APP
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-red-200/80 mb-3 font-medium">
            Choose your AI companion — Caption your world or Challenge your mind.
          </p>

          <p className="text-sm text-red-300/60">Hello from your region 👋</p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <ToolCard
              title="Image Caption Generator"
              description="Upload an image and let AI craft a short, creative caption."
              icon="🖼️"
              onClick={() => onNavigate("caption")}
              gradient="from-red-500 to-orange-500"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <ToolCard
              title="AI Quiz Generator"
              description="Type a topic. Get 5-12 MCQs with instant answer reveal."
              icon="🧠"
              onClick={() => onNavigate("quiz")}
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </div>

        <div
          className="text-center p-4 rounded-lg bg-red-500/5 border border-red-500/20 backdrop-blur-sm animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-sm text-red-300/70">Built by Siddhant Mohan Jha ⚡ with GPT-5</p>
        </div>
      </div>
    </div>
  )
}
