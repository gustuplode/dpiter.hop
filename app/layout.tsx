import type React from "react"
import type { Metadata } from "next"
import { Poppins } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LoadingBar } from "@/components/loading-bar"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.vercel.app"),
  title: {
    default: "Dpiter - Best Shopping Website for Boys | Online Clothing Store India USA UK",
    template: "%s | Dpiter - Best Shopping Website"
  },
  description:
    "Dpiter is the best shopping website for boys offering premium fashion collections at affordable prices. Shop best clothing website India, USA, UK. Full outfit collection low price. Discover trendy clothes, shoes, accessories similar to Meesho, Flipkart, Amazon. Free shipping on orders above ₹999.",
  keywords: [
    // Primary Keywords
    "dpiter",
    "dpiter shopping",
    "dpiter online store",
    "best shopping website for boys",
    "best clothing website for boy",
    "best clothing website India",
    "best clothing website USA", 
    "best clothing website UK",
    "full outfit collection low price",
    // E-commerce Comparison Keywords
    "shopping like meesho",
    "online shopping like flipkart",
    "affordable fashion like amazon",
    "shopping site like myntra",
    "clothes shopping like ajio",
    "budget shopping india",
    // Fashion & Lifestyle
    "boys fashion online",
    "boys clothing store",
    "mens fashion india",
    "trendy clothes for boys",
    "stylish outfits boys",
    "casual wear boys",
    "formal wear boys",
    "streetwear india",
    // Price & Deals
    "affordable fashion India",
    "cheap clothes online",
    "discount clothing india",
    "premium brands low price",
    "fashion deals",
    "shopping deals india",
    "branded clothes affordable",
    "budget fashion store",
    "low price shopping",
    // Product Categories
    "boys shirts",
    "boys jeans",
    "boys tshirts",
    "boys jackets",
    "boys shoes",
    "boys accessories",
    "full outfit sets",
    "combo offers clothing",
    // Shopping Features
    "online shopping India",
    "online fashion store",
    "fashion collections",
    "lifestyle products",
    "trendy fashion",
    "latest fashion trends",
    "exclusive collections",
    // Location Based
    "online shopping india",
    "shopping website india",
    "fashion store usa",
    "clothing uk",
    "international shipping",
    // Brand & Quality
    "branded clothes",
    "quality clothing",
    "premium fashion",
    "authentic brands",
    "original products",
    // Generic High-Volume Keywords
    "shopping",
    "online shopping",
    "fashion",
    "clothing",
    "clothes",
    "lifestyle",
    "trends",
    "deals",
    "offers",
    "sale",
  ],
  authors: [{ name: "Dpiter", url: "https://dpiter.vercel.app" }],
  creator: "Dpiter",
  publisher: "Dpiter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Dpiter - Best Shopping Website for Boys | Affordable Fashion Collections",
    description: "Shop premium fashion at affordable prices. Best clothing website for boys in India, USA, UK. Full outfit collection low price with exclusive deals.",
    type: "website",
    siteName: "Dpiter",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dpiter - Best Shopping Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dpiter - Best Shopping Website for Boys",
    description: "Discover curated fashion collections at affordable prices. Shop now!",
    creator: "@dpiter",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "oAxbL_tiEoWvDgMQCCvT-bx5SpTHBRKA9yetJtFsoCw",
    other: {
      "msvalidate.01": "FC0ED3E2CD6BC6E015201B4F0DABF03E",
      monetag: "8e701858f43c71973d12ef290cd91d1f",
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.vercel.app",
  },
  other: {
    "google-adsense-account": "ca-pub-8731726233953156",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dpiter",
    description: "Best shopping website for boys with premium fashion collections at affordable prices",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.vercel.app"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    sameAs: [
      "https://www.facebook.com/share/1PwVj2Bg4Z/",
      "https://www.instagram.com/deepiter_mark?igsh=MXh5djE1NzlkMTlo"
    ]
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dpiter",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.vercel.app"}/logo.png`,
    description: "Best online shopping website for boys offering premium fashion at affordable prices",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "Hindi"]
    },
    sameAs: [
      "https://www.facebook.com/share/1PwVj2Bg4Z/",
      "https://www.instagram.com/deepiter_mark?igsh=MXh5djE1NzlkMTlo"
    ]
  }

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="oAxbL_tiEoWvDgMQCCvT-bx5SpTHBRKA9yetJtFsoCw" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${poppins.className} font-display antialiased`}>
        <LoadingBar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
