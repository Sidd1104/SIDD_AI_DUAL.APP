"use client"

interface HeaderProps {
  currentPage: "home" | "caption" | "quiz"
  onNavigate: (page: "home" | "caption" | "quiz") => void
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/50 border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ⚡
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hidden sm:inline">
                SIDD Creation
              </span>
              <span className="text-xs font-medium text-blue-300/70 hidden sm:inline">AI DuoLab</span>
            </div>
          </button>

          <nav className="flex items-center gap-2 sm:gap-4">
            {currentPage !== "home" && (
              <button
                onClick={() => onNavigate("home")}
                className="px-3 sm:px-4 py-2 text-sm font-medium text-blue-300 hover:text-blue-100 hover:scale-105 transition-all duration-300"
              >
                Home
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
