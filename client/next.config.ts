/**
 * NEXT.JS CONFIGURATION
 *
 * This file configures Next.js build and runtime behavior.
 *
 * CURRENT STATE:
 * - Using default Next.js configuration
 * - No custom modifications needed for this app
 *
 * COMMON CUSTOMIZATIONS YOU MIGHT ADD:
 *
 * 1. Image domains (if loading images from external URLs):
 *    ```ts
 *    images: {
 *      domains: ['yourdomain.com'],
 *    }
 *    ```
 *
 * 2. Environment variables:
 *    ```ts
 *    env: {
 *      CUSTOM_KEY: process.env.CUSTOM_KEY,
 *    }
 *    ```
 *
 * 3. Redirects:
 *    ```ts
 *    async redirects() {
 *      return [
 *        {
 *          source: '/old-path',
 *          destination: '/new-path',
 *          permanent: true,
 *        },
 *      ]
 *    }
 *    ```
 *
 * 4. Headers (for CORS, CSP, etc):
 *    ```ts
 *    async headers() {
 *      return [
 *        {
 *          source: '/api/:path*',
 *          headers: [
 *            { key: 'Access-Control-Allow-Origin', value: '*' },
 *          ],
 *        },
 *      ]
 *    }
 *    ```
 *
 * DOCUMENTATION:
 * https://nextjs.org/docs/app/api-reference/next-config-js
 */

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    // Set environment variables in your .env.local file
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
  },
}

export default nextConfig
