/**
 * UTILITY FUNCTIONS
 *
 * This file contains helper functions used throughout the application.
 * Functions are organized by category for easy discovery.
 *
 * CATEGORIES:
 * 1. Address Formatting - Display Ethereum addresses in shortened form
 * 2. Number Formatting - Add commas, convert between units
 * 3. String Manipulation - Truncate, add HTTP protocol
 * 4. Array Operations - Shuffle arrays
 * 5. DOM Manipulation - Custom viewport settings
 *
 * USAGE:
 * Import individual functions as needed:
 * ```tsx
 * import { formatAddress, shuffle } from '@/utils'
 * ```
 */

import { addressType } from './types/types'
import { ethers } from 'ethers'

// ============================================================================
// ADDRESS FORMATTING
// ============================================================================

/**
 * Shorten Ethereum address for display
 *
 * @param address - Full Ethereum address (0x...)
 * @returns Shortened format: "0x1234...56789"
 *
 * @example
 * formatAddress("0x1234567890123456789012345678901234567890")
 * // Returns: "0x123456...67890"
 */
export const formatAddress = (address: addressType) => {
  return address && `${address.substring(0, 6)}...${address.substring(address.length - 5)}`
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format number with commas as thousands separators
 *
 * @param x - Number or string to format
 * @returns Formatted string with commas
 *
 * @example
 * formatNumber(1000000) // Returns: "1,000,000"
 */
export const formatNumber = (x: number | string) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

/**
 * Format and commify ethers BigNumber units
 * Converts wei to ether and adds comma formatting
 */
export const formatCommifyUnit = (unit: ethers.BigNumberish): string => {
  return ethers.formatUnits(unit)
}

/**
 * Add commas to number (alias for formatNumber)
 * @param unit - Number or string to format
 * @returns String with comma separators
 */
export const commify = (unit: string | number): string => {
  return unit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Convert BigNumber to human-readable string (wei to ether)
 * @param unit - BigNumber in wei
 * @returns String representation in ether
 */
export const formatUnit = (unit: ethers.BigNumberish): string => {
  return ethers.formatUnits(unit)
}

/**
 * Convert number to BigNumber (ether to wei)
 * @param unit - Number in ether
 * @returns BigNumber in wei
 */
export const bigNumber = (unit: number | string): bigint => {
  return ethers.parseEther(unit.toString())
}

/**
 * Validate number is within valid range
 * @param number - Number to validate
 * @param max - Maximum allowed value
 * @returns true if valid (0 < number <= max)
 */
export const rangeValidation = (number: string | number, max: ethers.BigNumberish): boolean => {
  return parseFloat(number.toString()) > 0 && parseFloat(number.toString()) <= parseFloat(formatUnit(max))
}

// ============================================================================
// STRING MANIPULATION
// ============================================================================

/**
 * Truncate string with ellipsis in middle
 *
 * @param string - String to truncate
 * @param number - Number of chars to keep on each end
 * @returns Truncated string with "..." in middle
 *
 * @example
 * truncate("This is a very long string", 4)
 * // Returns: "This...ring"
 */
export const truncate = (string: string, number: number): string => {
  if (string.length > number)
    string = string.substr(0, number) + '...' + string.substr(string.length - number, string.length)
  return string
}

/**
 * Add http:// protocol to URL if missing
 *
 * @param url - URL string
 * @returns URL with http:// or https:// protocol
 *
 * @example
 * withHttp("example.com") // Returns: "http://example.com"
 * withHttp("https://example.com") // Returns: "https://example.com"
 */
export const withHttp = (url: string): string => (!/^https?:\/\//i.test(url) ? `http://${url}` : url)

/**
 * Format number with commas (duplicate of formatNumber)
 * Kept for backwards compatibility
 */
export const numberWithCommas = (x: number | string): string => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// ============================================================================
// ARRAY OPERATIONS
// ============================================================================

/**
 * Fisher-Yates shuffle algorithm (in-place)
 * Randomly shuffles array elements
 *
 * IMPORTANT: Modifies the array in place
 *
 * @param array - Array to shuffle
 *
 * @example
 * const arr = [1, 2, 3, 4, 5]
 * shuffle(arr)
 * // arr is now shuffled in place
 *
 * USED IN:
 * - Phase 2: Randomize project display order for fair voting
 */
export const shuffle = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
  }
}

// ============================================================================
// DOM MANIPULATION
// ============================================================================

/**
 * Custom viewport meta tag for mobile
 *
 * Sets specific viewport settings for mobile optimization
 * Prevents zooming and sets fixed width
 *
 * USAGE:
 * Call this in useEffect on mobile-specific pages if needed
 *
 * NOTE:
 * - Currently not used in the app
 * - Kept for potential mobile-specific viewport needs
 * - Viewport is set in layout.tsx via Next.js metadata
 */
export function customViewport() {
  const targetContent = 'width=500, shrink-to-fit=yes, maximum-scale=1, user-scalable=0'
  const viewports = document.querySelectorAll('meta[name="viewport"]')

  // Check and update each viewport meta element
  viewports.forEach((viewport) => {
    const vp = viewport as HTMLMetaElement
    if (vp.content !== targetContent) {
      vp.content = targetContent
    }
  })

  // If no viewport meta tags exist, add the target one
  if (viewports.length === 0) {
    const viewportMeta = document.createElement('meta')
    viewportMeta.name = 'viewport'
    viewportMeta.content = targetContent
    document.head.appendChild(viewportMeta)
  }
}
