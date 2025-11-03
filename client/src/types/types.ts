/**
 * TYPE DEFINITIONS
 *
 * This file contains all TypeScript type definitions and interfaces used throughout the application.
 * Organized by category for easy navigation and maintenance.
 *
 * CATEGORIES:
 * 1. Basic Types - Simple type aliases
 * 2. Data Interfaces - Data structures from backend
 * 3. Component Props - Props for all components
 *
 * CUSTOMIZATION:
 * - Add new interfaces as you create new components
 * - Modify existing interfaces if backend API changes
 * - Keep consistent naming: ComponentNameProps for component props
 *
 * IMPORTANT:
 * - All interfaces are exported for use across the app
 * - Props interfaces match component function signatures
 * - Backend data structures match API responses
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

/**
 * Ethereum address type
 * - Format: 0x followed by 40 hex characters
 * - Can be undefined when wallet not connected
 */
export type addressType = `0x${string}` | undefined

/**
 * Wallet connection status
 * - disconnected: No wallet connected
 * - connecting: Connection in progress (signing message)
 * - connected: Wallet connected and authenticated
 */
export type WalletStatus = 'disconnected' | 'connecting' | 'connected'

// ============================================================================
// DATA INTERFACES - Backend Data Structures
// ============================================================================

/**
 * User's voting data from backend
 * Returned from GET /posts/score/:address
 */
export interface AddressDetails {
  score: number // Remaining vote credits
  picks: Array<{ id: string; points: number }> // Previous vote allocations
  _id?: string // MongoDB document ID (optional)
  [key: string]: unknown // Allow additional fields
}

/**
 * Project data structure
 * Used in Phase 2 (voting) and Phase 3 (results)
 */
export interface Project {
  _id: string // Unique project ID (from backend)
  projectName: string // Project/individual name
  projectDescription: string // Reason for funding
  website: string // Project website URL
  address: string // Associated Ethereum address
  icon: string // Project icon/avatar URL
  currentScore?: number // Total points received (Phase 3)
  usdcAmount?: number // Calculated USDC funding amount (Phase 3)
}

/**
 * Project popup details
 * Used to pass project data to popup modals
 */
export interface PopupDetails {
  name: string // Project name
  message: string // Project description
  link: string // Website URL
  paddress: string // Ethereum address
  image: string // Icon URL
  id?: string // Project ID (for voting popup)
  points?: number // Current vote allocation (for voting popup)
}

// ============================================================================
// COMPONENT PROPS INTERFACES
// ============================================================================

/**
 * Error Popup Component Props
 */
export interface ErrorPopupProps {
  errorPopupStatus: boolean // Controls popup visibility
  setErrorPopupStatus: (status: boolean) => void // Function to close popup
}

/**
 * Phase 1 Component Props
 */
export interface Phase1Props {
  setPhaseView: (view: string) => void // Function to switch phases
}

/**
 * Nomination Popup Component Props
 */
export interface NominatePopupProps {
  popupStatus: string // 'hidden' | 'nominate' | 'submitted'
  setPopupStatus: (status: string) => void // Update popup state
  setErrorPopupStatus: (status: boolean) => void // Show error popup if submission fails
}

/**
 * Phase 2 Component Props
 */
export interface Phase2Props {
  loadWeb3: (type: 'load' | 'click') => Promise<void>
  disconnectWeb3: () => Promise<void>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signer: any
  address: string
  addressDetails: AddressDetails | 'none'
  walletStatus: WalletStatus
  points: number
  setPoints: (points: number) => void
  votes: Record<string, number>
  setVotes: React.Dispatch<React.SetStateAction<Record<string, number>>>
  setPhaseView: (view: string) => void
}

/**
 * Phase 2 Header Component Props
 */
export interface Phase2HeaderProps {
  loadWeb3: (type: 'load' | 'click') => Promise<void> // Connect wallet function
  disconnectWeb3: () => Promise<void> // Disconnect wallet function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signer: any // Ethers.js signer for signing messages
  address: string // Connected wallet address
  addressDetails: AddressDetails | 'none' // User's voting data from backend
  walletStatus: WalletStatus // Connection status
  points: number // Remaining vote credits
  votes: Record<string, number> // Current vote allocations
  setVotesSubmitted: (status: string) => void // Update submission status
  votesSubmitted: string // 'false' | 'sending' | 'true'
  setErrorPopupStatus: (status: boolean) => void // Show error popup
}

/**
 * Phase 2 Project Card Component Props
 */
export interface Phase2ProjectProps {
  index: number // Card index for color rotation
  id: string // Project ID
  name: string // Project name
  desc: string // Project description (for popup)
  website: string // Project website URL
  paddress: string // Project Ethereum address
  icon: string // Project icon URL
  setPopupStatus: (status: string) => void // Open project popup
  setPopupDetails: (details: PopupDetails) => void // Set popup data
  setVotes: React.Dispatch<React.SetStateAction<Record<string, number>>> // Update votes
  votes: Record<string, number> // Current vote allocations
  points: number // Remaining vote credits
  setPoints: (points: number) => void // Update points
  votesSubmitted: string // Submission status
  address: string // User's wallet address
}

/**
 * Phase 2 Project Popup Component Props
 */
export interface Phase2ProjectPopupProps {
  popupStatus: string // 'hidden' | 'visible'
  setPopupStatus: (status: string) => void // Close popup
  popupDetails: PopupDetails // Project data to display
  setVotes: React.Dispatch<React.SetStateAction<Record<string, number>>> // Update votes
  votes: Record<string, number> // Current vote allocations
  points: number // Remaining vote credits
  setPoints: (points: number) => void // Update points
  votesSubmitted: string // Submission status
}

/**
 * Done Popup Component Props (Phase 2)
 */
export interface DonePopupProps {
  donePopupStatus: boolean // Controls popup visibility
  setDonePopupStatus: (status: boolean) => void // Close popup function
}

/**
 * Phase 3 Component Props
 */
export interface Phase3Props {
  loadWeb3: (type: 'load' | 'click') => Promise<void> // Connect wallet function
  disconnectWeb3: () => Promise<void> // Disconnect wallet function
  address: string // Connected wallet address
  addressDetails: AddressDetails | 'none' // User's voting data
  walletStatus: WalletStatus // Connection status
  poap: boolean // POAP eligibility
}

/**
 * Phase 3 Header Component Props
 */
export interface Phase3HeaderProps {
  loadWeb3: (type: 'load' | 'click') => Promise<void> // Connect wallet function
  disconnectWeb3: () => Promise<void> // Disconnect wallet function
  address: string // Connected wallet address
  walletStatus: WalletStatus // Connection status
  winner: string // POAP eligibility ('check' | 'winner' | 'no-winner')
}

/**
 * Phase 3 Project Card Component Props
 */
export interface Phase3ProjectProps {
  index: number // Card index for color rotation
  id: string // Project ID
  name: string // Project name
  desc: string // Project description
  website: string // Project website URL
  paddress: string // Project Ethereum address
  icon: string // Project icon URL
  points: number // Total votes received
  usdcAmount: number // Calculated funding amount (not currently used)
  setPopupStatus: (status: string) => void // Open project popup
  setPopupDetails: (details: PopupDetails) => void // Set popup data
  votedProjects: string[] | undefined // Projects user voted for
  walletStatus: WalletStatus // Connection status
  pointsSum: number // Total votes across all projects
}

/**
 * Phase 3 Project Popup Component Props
 */
export interface Phase3ProjectPopupProps {
  popupStatus: string // 'hidden' | 'visible'
  setPopupStatus: (status: string) => void // Close popup
  popupDetails: PopupDetails // Project data to display
}
