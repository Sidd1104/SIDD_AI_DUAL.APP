"use client"

import { useEffect, useRef } from "react"

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  opacity: number
  width: number
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Set canvas to cover entire viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const shootingStars: ShootingStar[] = []

    for (let i = 0; i < 18; i++) {
      shootingStars.push({
        x: Math.random() * canvas.width * 0.3,
        y: Math.random() * canvas.height * 0.3,
        vx: Math.random() * 0.4 + 0.2,
        vy: Math.random() * 0.4 + 0.2,
        length: Math.random() * 40 + 20,
        opacity: Math.random() * 0.6 + 0.4,
        width: Math.random() * 1 + 0.5,
      })
    }

    let animationId: number
    let isRunning = true

    const animate = () => {
      if (!isRunning) return

      ctx.fillStyle = "#0a0e27"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle blue glow overlay with reduced opacity
      const glowGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height),
      )
      glowGradient.addColorStop(0, "rgba(20, 40, 100, 0.08)")
      glowGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = glowGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update shooting stars
      shootingStars.forEach((star, index) => {
        const staggerDelay = (index * 2000) % 8000
        const adjustedOpacity = star.opacity - (0.0008 + (index % 3) * 0.0002)

        // Update position with slow motion
        star.x += star.vx
        star.y += star.vy
        star.opacity = adjustedOpacity

        if (star.x > canvas.width + star.length || star.y > canvas.height + star.length || star.opacity <= 0) {
          star.x = Math.random() * canvas.width * 0.2 - star.length
          star.y = Math.random() * canvas.height * 0.2 - star.length
          star.opacity = Math.random() * 0.6 + 0.4
          star.vx = Math.random() * 0.4 + 0.2
          star.vy = Math.random() * 0.4 + 0.2
        }

        const gradient = ctx.createLinearGradient(star.x - star.length, star.y - star.length, star.x, star.y)
        gradient.addColorStop(0, `rgba(59, 130, 246, 0)`)
        gradient.addColorStop(0.3, `rgba(59, 130, 246, ${star.opacity * 0.6})`)
        gradient.addColorStop(1, `rgba(59, 130, 246, ${star.opacity * 1.2})`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = star.width
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.beginPath()
        ctx.moveTo(star.x - star.length, star.y - star.length)
        ctx.lineTo(star.x, star.y)
        ctx.stroke()

        ctx.fillStyle = `rgba(147, 197, 253, ${star.opacity * 1.3})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.width * 1.5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(59, 130, 246, ${star.opacity * 0.4})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.width * 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw twinkling background stars
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
      for (let i = 0; i < 80; i++) {
        const x = (i * 73) % canvas.width
        const y = (i * 97) % canvas.height
        const size = Math.sin(Date.now() * 0.0005 + i) * 0.5 + 0.8
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isRunning = false
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        display: "block",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  )
}
