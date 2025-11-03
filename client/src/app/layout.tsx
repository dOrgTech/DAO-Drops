/**
 * ROOT LAYOUT COMPONENT
 *
 * This is the root layout for the entire Next.js application using the App Router.
 * It wraps all pages and provides global configuration including metadata, viewport settings,
 * and the Web3 wallet provider context.
 *
 * CUSTOMIZATION POINTS:
 * - Metadata (title, description, images): Edit values in src/config.tsx under `appMetadata`
 * - Favicon and social sharing images: Replace files in /public/ directory
 * - Theme color: Update `themeColor` below (also affects mobile browser chrome)
 * - Web3 provider: Configure in src/context/Reown.tsx
 * - Global styles: Edit src/app/globals.css
 *
 * IMPORTANT:
 * - This file runs on the server by default (Next.js 13+ App Router)
 * - The ReownProvider wraps the app to enable Web3 wallet connections throughout
 * - All metadata is automatically generated for SEO and social media sharing
 */

import type { Metadata } from 'next'
import type { Viewport } from 'next'
import ReownProvider from '@/context/Reown'
import { appMetadata } from '@/config'
import './globals.css'

/**
 * Base metadata shared across different meta tag types
 * Centralized to ensure consistency between OpenGraph, Twitter, and standard meta tags
 */
const baseMetadata = {
  title: appMetadata.title,
  description: appMetadata.description,
}

/**
 * Next.js Metadata object - generates all SEO-related meta tags
 *
 * CUSTOMIZATION:
 * - Edit all text and image paths in src/config.tsx under `appMetadata`
 * - Replace images in /public/ directory (keep same names or update paths in config)
 * - metadataBase is required for relative URLs in metadata
 */
export const metadata: Metadata = {
  metadataBase: new URL(appMetadata.baseUrl), // Required for relative URLs in metadata
  ...baseMetadata,

  // Favicon configuration - supports SVG for modern browsers
  icons: {
    icon: [{ url: appMetadata.images.favicon }],
    shortcut: [{ url: appMetadata.images.favicon, sizes: 'any', type: 'image/svg+xml' }],
  },

  // OpenGraph tags for Facebook, LinkedIn, and other platforms
  openGraph: {
    ...baseMetadata,
    url: appMetadata.baseUrl,
    images: [appMetadata.images.openGraph], // Custom image for Facebook sharing
    type: 'website',
    siteName: baseMetadata.title,
  },

  // Twitter Card tags for Twitter/X sharing
  twitter: {
    ...baseMetadata,
    card: 'summary_large_image', // Large image format for better engagement
    images: [appMetadata.images.twitter], // Custom image for Twitter sharing
  },
}

/**
 * Viewport configuration for responsive design
 *
 * CUSTOMIZATION:
 * - Adjust viewport settings if needed for your design
 * - themeColor affects mobile browser UI color (address bar on mobile)
 */
export const viewport: Viewport = {
  width: 'device-width, shrink-to-fit=yes',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zoom on mobile for app-like experience
  themeColor: '#ffffff', // Mobile browser chrome color
}

/**
 * Root Layout Component
 *
 * This wraps all pages in the application with:
 * 1. HTML structure and language setting
 * 2. Global styles (antialiased text rendering)
 * 3. ReownProvider for Web3 wallet connection throughout the app
 *
 * DO NOT REMOVE:
 * - The ReownProvider wrapper (required for wallet functionality in Phase 2 & 3)
 * - The <html> and <body> tags (required by Next.js App Router)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        {/* ReownProvider enables Web3 wallet connections across the entire app */}
        <ReownProvider>{children}</ReownProvider>
      </body>
    </html>
  )
}
