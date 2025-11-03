/**
 * REOWN APPKIT PROVIDER (Web3 Wallet Connection)
 *
 * This file sets up the Reown AppKit (formerly WalletConnect) for Web3 wallet connections.
 * It configures the modal/UI that users see when connecting their wallets.
 *
 * WHAT IT DOES:
 * - Creates the wallet connection modal used throughout the app
 * - Configures supported blockchain networks
 * - Sets up wallet metadata (name, description, icons)
 * - Applies theme customization (colors, mode)
 * - Enables analytics tracking
 *
 * REQUIRED CONFIGURATION:
 * - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local
 *   Get from: https://cloud.reown.com
 *
 * CUSTOMIZATION POINTS:
 * - Networks: Edit src/config.tsx under `networks` (default: Ethereum mainnet)
 * - Wallet metadata: Edit src/config.tsx under `walletMetadata`
 * - App metadata: Edit src/config.tsx under `appMetadata`
 * - Theme: Edit walletMetadata.theme in src/config.tsx
 *   - mode: 'light' | 'dark'
 *   - accentColor: hex color for buttons/highlights
 *
 * HOW IT WORKS:
 * 1. This provider wraps the entire app (see src/app/layout.tsx)
 * 2. The modal is created once and accessible via useAppKit() hook
 * 3. Components use useAppKit, useAppKitAccount, useAppKitProvider hooks
 * 4. When user clicks "Connect Wallet", the modal opens with wallet options
 * 5. User selects wallet (MetaMask, WalletConnect, Coinbase, etc.)
 * 6. Wallet connection is established and available throughout the app
 *
 * IMPORTANT:
 * - The provider itself doesn't render anything (just returns children)
 * - The actual modal UI is handled by Reown AppKit library
 * - Error thrown if projectId is missing (prevents runtime errors)
 *
 * SUPPORTED WALLETS:
 * - MetaMask, Rainbow, Coinbase Wallet, WalletConnect, and 300+ others
 * - Desktop: Browser extensions
 * - Mobile: Deep links to wallet apps
 *
 * ANALYTICS:
 * - Enabled by default (can be disabled with features.analytics: false)
 * - Sends usage data to Reown Cloud dashboard
 */

'use client'

import { ethersAdapter, projectId, networks, appMetadata, walletMetadata } from '@/config'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'

/**
 * Validate project ID exists
 * This is required for Reown AppKit to function
 * Get your project ID from https://cloud.reown.com
 */
if (!projectId) {
  throw new Error('Project ID is not defined')
}

/**
 * Set up wallet connection metadata
 * This appears in the wallet connection modal and wallet app UI
 */
const metadata = {
  name: walletMetadata.name,
  description: walletMetadata.description,
  url: appMetadata.baseUrl,
  icons: [...walletMetadata.icons], // Convert readonly array to mutable array
}

/**
 * Create the Reown AppKit modal
 * This modal is used throughout the app for wallet connections
 *
 * CONFIGURATION:
 * - adapters: [ethersAdapter] - Uses Ethers.js v6 for blockchain interactions
 * - projectId: From environment variable (NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)
 * - networks: Supported blockchain networks (configured in src/config.tsx)
 * - metadata: App name, description, URL, icons
 * - themeMode: 'light' or 'dark'
 * - features.analytics: Enable usage tracking (true/false)
 * - themeVariables: CSS variables for custom styling
 *
 * CUSTOMIZATION:
 * - Change accent color: Edit walletMetadata.theme.accentColor in src/config.tsx
 * - Add more networks: Edit `networks` array in src/config.tsx
 * - Disable analytics: Set features.analytics to false
 * - Change theme mode: Edit walletMetadata.theme.mode in src/config.tsx
 */
export const modal = createAppKit({
  adapters: [ethersAdapter], // Ethers.js v6 adapter for blockchain interactions
  projectId, // WalletConnect project ID (required)
  networks, // Supported blockchain networks
  metadata, // App metadata for wallet displays
  themeMode: walletMetadata.theme.mode, // 'light' or 'dark' theme
  features: {
    analytics: true, // Enable usage analytics (optional)
  },
  themeVariables: {
    '--w3m-accent': walletMetadata.theme.accentColor, // Accent color for buttons/highlights
  },
})

/**
 * Reown Provider Component
 *
 * This provider wraps the entire application to enable wallet connections.
 * It doesn't render any UI itself - just passes children through.
 * The actual wallet modal UI is managed by the createAppKit call above.
 *
 * USAGE:
 * Wrap your app in this provider (already done in src/app/layout.tsx):
 * ```tsx
 * <ReownProvider>
 *   <YourApp />
 * </ReownProvider>
 * ```
 */
function ReownProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export default ReownProvider
