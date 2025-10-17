"use client"

interface ToolCardProps {
  title: string
  description: string
  icon: string
  onClick: () => void
  gradient: string
}

export default function ToolCard({ title, description, icon, onClick, gradient }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-2xl overflow-hidden group cursor-pointer hover:scale-103 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-red-950/80 backdrop-blur-sm" />

      {/* Animated gradient border effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
      />

      {/* Premium glowing border with red accent */}
      <div className="absolute inset-0 rounded-2xl border border-red-500/30 group-hover:border-red-400/60 transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:shadow-red-500/50" />

      {/* Content */}
      <div className="relative flex flex-col items-start justify-between p-8 h-full min-h-56">
        {/* Icon and Title */}
        <div className="w-full">
          <div className="text-5xl mb-4 inline-block group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-red-200/70 text-sm leading-relaxed">{description}</p>
        </div>

        <button className="mt-6 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-red-500/50 hover:scale-108 transition-all duration-300 relative overflow-hidden group/btn">
          <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          <span className="relative">Open</span>
        </button>
      </div>
    </button>
  )
}
