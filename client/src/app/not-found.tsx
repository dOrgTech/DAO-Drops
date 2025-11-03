/**
 * NOT FOUND PAGE (404)
 *
 * This page handles all 404 errors by automatically redirecting users to the home page.
 * Instead of showing a traditional "Page Not Found" error, we provide a seamless
 * experience by returning users to the main application.
 *
 * BEHAVIOR:
 * - Any invalid URL automatically redirects to '/'
 * - Redirect happens immediately on component mount
 * - No visual content is displayed during redirect
 *
 * CUSTOMIZATION:
 * - To show a custom 404 page instead, replace `router.replace('/')` with JSX content
 * - To redirect to a different page, change '/' to your desired path
 * - To add a delay before redirect, wrap router.replace in setTimeout
 *
 * WHY THIS APPROACH?
 * - Single-page application behavior: keeps users in the app
 * - Better UX: no dead ends or confusing error pages
 * - Simpler maintenance: no need to design/maintain 404 page
 */

'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page after component mounts
    router.replace('/')
  }, [router])

  return null // No content shown during redirect
}
