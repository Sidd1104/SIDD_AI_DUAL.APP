import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import AnimatedBackground from "@/components/animated-background"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SIDD AI DUAL APP - Advanced AI Caption & Quiz Generator",
  description:
    "Experience the future of AI with SIDD AI DUAL APP. Generate stunning image captions and engaging quiz questions powered by advanced AI technology. Professional-grade tools for content creators and educators.",
  keywords: "AI, image caption generator, quiz generator, content creation, AI tools, machine learning",
  authors: [{ name: "Siddhant Mohan Jha" }],
  creator: "Siddhant Mohan Jha",
  publisher: "SIDD AI DUAL APP",
  robots: "index, follow",
  openGraph: {
    title: "SIDD AI DUAL APP - Dual AI Tools for Content Creation",
    description: "Generate image captions and quiz questions with cutting-edge AI technology",
    type: "website",
    url: "https://sidd-ai-dual-app.vercel.app",
    siteName: "SIDD AI DUAL APP",
    images: [
      {
        url: "https://sidd-ai-dual-app.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SIDD AI DUAL APP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIDD AI DUAL APP",
    description: "Advanced AI tools for caption and quiz generation",
  },
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: "#0f172a",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' fontSize='75' fill='%23ff4444'>⚡</text></svg>"
        />
        {/* Schema markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SIDD AI DUAL APP",
              description: "Advanced AI tools for caption and quiz generation",
              url: "https://sidd-ai-dual-app.vercel.app",
              applicationCategory: "Productivity",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased bg-black min-h-screen overflow-x-hidden`}>
        <AnimatedBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
