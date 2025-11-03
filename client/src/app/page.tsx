/**
 * MAIN APPLICATION PAGE (HOME)
 *
 * This is the central orchestration point for the entire DAO Drops application.
 * It manages:
 * - Phase switching between Phase 1 (Nomination), Phase 2 (Voting), Phase 3 (Results), and Pause
 * - Web3 wallet connection state and authentication
 * - User data loading from the backend API
 * - Vote and point persistence in localStorage
 *
 * ARCHITECTURE:
 * - This is a client component ('use client') that handles all state management
 * - State is passed down to phase components via props (no global state library needed)
 * - Each phase is a separate component that receives only what it needs
 *
 * CUSTOMIZATION POINTS:
 * - Phase logic: Configure in src/config.tsx under `phases`
 * - API endpoints: Configure in src/config.tsx under `apiEndpoints`
 * - Authentication message: Configure in src/config.tsx under `authConfig`
 * - Phase components: Customize in src/components/Phase1, Phase2, Phase3
 *
 * WALLET INTEGRATION:
 * - Uses Reown AppKit (formerly WalletConnect) for wallet connections
 * - Authentication via web3-token (signed messages)
 * - Token stored in localStorage per wallet address
 *
 * STATE MANAGEMENT:
 * - addressDetails: User's vote credits and previous allocations from backend
 * - walletStatus: Current wallet connection state ('disconnected' | 'connecting' | 'connected')
 * - phaseView: Current phase to display ('1' | '2' | '3' | 'p')
 * - votes: Current vote allocations (persisted to localStorage)
 * - points: Remaining vote credits (calculated from addressDetails.score)
 */

'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Phase1 from '@/components/Phase1'
import Phase2 from '@/components/Phase2'
import Phase3 from '@/components/Phase3'
import Pause from '@/components/Pause'
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider } from 'ethers'
import { useDisconnect } from '@reown/appkit/react'
import Web3Token from 'web3-token'
import axios from 'axios'
import type { AddressDetails, WalletStatus } from '@/types/types'
import { apiEndpoints, phases, authConfig } from '@/config'

/**
 * Home Component - Main Application Entry Point
 */
export default function Home() {
  // ============================================================================
  // REOWN APPKIT HOOKS - Web3 Wallet Connection
  // ============================================================================

  /**
   * Reown AppKit hooks provide:
   * - open(): Function to open wallet connection modal
   * - address: Connected wallet address (or undefined if not connected)
   * - isConnected: Boolean indicating if wallet is connected
   * - walletProvider: The underlying wallet provider for signing transactions
   * - disconnect(): Function to disconnect wallet
   */
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155') // 'eip155' is the CAIP-2 namespace for Ethereum
  const { disconnect } = useDisconnect()

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * addressDetails: User's voting data from backend
   * - 'none': No data loaded yet (initial state)
   * - AddressDetails object: Contains score (remaining points) and picks (vote history)
   */
  const [addressDetails, setAddressDetails] = useState<AddressDetails | 'none'>('none')

  /**
   * walletStatus: Tracks wallet connection state
   * - 'disconnected': No wallet connected
   * - 'connecting': In the process of connecting/signing
   * - 'connected': Wallet connected and authenticated
   */
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('disconnected')

  /**
   * poap: Whether user is eligible to claim POAP (Phase 3)
   * - true: User has participated and can claim POAP
   * - false: User hasn't participated or already claimed
   * Set to true when user's score === 0 (spent all points)
   */
  const [poap, setPoap] = useState(false)

  /**
   * phaseView: Current phase to display
   * - '1': Phase 1 (Nomination)
   * - '2': Phase 2 (Voting)
   * - '3': Phase 3 (Results)
   * - 'p': Pause (transition phase)
   *
   * CUSTOMIZATION: Change initial phase in src/config.tsx under phases.initial
   */
  const [phaseView, setPhaseView] = useState<string>(phases.initial)

  /**
   * signer: Ethers.js signer object for signing messages
   * Used for web3-token authentication
   */
  const [signer, setSigner] = useState<{ signMessage: (msg: string) => Promise<string> } | null>(null)

  /**
   * points: User's remaining vote credits
   * Calculated from addressDetails.score and current vote allocations
   */
  const [points, setPoints] = useState<number>(0)

  /**
   * votes: Current vote allocations by project ID
   * Format: { [projectId]: pointsAllocated }
   * Example: { "project123": 50, "project456": 30 }
   * Persisted to localStorage for draft saving
   */
  const [votes, setVotes] = useState<Record<string, number>>({})

  // ============================================================================
  // AUTHENTICATION & DATA LOADING
  // ============================================================================

  /**
   * Sign authentication message with wallet
   *
   * This function creates a web3-token by having the user sign a message with their wallet.
   * The resulting token is sent to the backend to prove wallet ownership.
   *
   * CUSTOMIZATION:
   * - Change the message text in src/config.tsx under authConfig.signMessage
   * - Change token expiration in src/config.tsx under authConfig.tokenExpiration
   *
   * @param signer - Ethers.js signer object from connected wallet
   * @returns web3-token string to be used in API request headers
   */
  async function sign(signer: { signMessage: (msg: string) => Promise<string> }): Promise<string> {
    const token = await Web3Token.sign(async (msg: string) => await signer.signMessage(msg), {
      statement: authConfig.signMessage, // Message user sees when signing
      expires_in: authConfig.tokenExpiration, // Token validity period (e.g., '5y', '30d', '1h')
    })
    return token
  }

  /**
   * Load user voting data from backend API
   *
   * Fetches the user's:
   * - score: Remaining vote credits
   * - picks: Previous vote allocations
   * - POAP eligibility (if score === 0, user has spent all points)
   *
   * BACKEND REQUIREMENT:
   * - Endpoint: GET /posts/score/:address
   * - Headers: { auth: <web3-token> }
   * - Response: { score: number, picks: [{ id: string, points: number }], _id?: string } | null
   *
   * @param userAddress - Wallet address to fetch data for
   * @param token - web3-token for authentication
   */
  const loadUserData = useCallback(async (userAddress: string, token: string) => {
    try {
      const response = await axios.get(apiEndpoints.score + userAddress.toLowerCase(), { headers: { auth: token } })

      if (response.data !== null) {
        setAddressDetails(response.data)
        // User is eligible for POAP if they've spent all their points
        setPoap(response.data['score'] === 0)
      }
      setWalletStatus('connected')
    } catch (e) {
      console.error('Error loading user data:', e)
      setWalletStatus('connected') // Still set to connected even if data fetch fails
    }
  }, [])

  /**
   * Handle wallet connection and authentication flow
   *
   * This is the main wallet connection function that:
   * 1. Opens wallet modal if not connected (when type === 'click')
   * 2. Gets the wallet provider and signer from Reown AppKit
   * 3. Checks localStorage for existing authentication token
   * 4. Requests signature if no token exists (only on user click, not on page load)
   * 5. Stores token in localStorage for future use
   * 6. Loads user data from backend using the token
   *
   * FLOW:
   * - type === 'click': User clicked "Connect Wallet" button - will request signature
   * - type === 'load': Page loaded with wallet already connected - only load if token exists
   *
   * LOCALSTORAGE STRUCTURE:
   * - Key: wallet address (e.g., "0x1234...")
   * - Value: web3-token string
   *
   * @param type - 'click' for user-initiated connection, 'load' for auto-connection on page load
   */
  const loadWeb3 = useCallback(
    async (type: 'load' | 'click') => {
      if (!walletProvider || !address) {
        // Wallet not connected yet
        if (type === 'click') {
          setWalletStatus('connecting')
          open() // Open Reown AppKit modal to select wallet
        }
        return
      }

      try {
        setWalletStatus('connecting')

        // Convert Reown provider to Ethers.js provider for easier interaction
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ethersProvider = new BrowserProvider(walletProvider as any)
        const ethersSigner = await ethersProvider.getSigner()
        const ethAddress = await ethersSigner.getAddress()

        setSigner(ethersSigner)

        // Check if we already have an authentication token for this address
        let token = localStorage.getItem(ethAddress)

        if (!token && type === 'load') {
          // On page load, don't request signature if no token exists
          // (only sign on explicit user action)
          setWalletStatus('disconnected')
          setSigner(null)
          return
        }

        if (!token) {
          // No token exists - request user to sign message
          token = await sign(ethersSigner)
          localStorage.setItem(ethAddress, token) // Store for future use
        }

        // Fetch user's voting data from backend
        await loadUserData(ethAddress, token)
      } catch (error) {
        console.error('Error connecting wallet:', error)
        setWalletStatus('disconnected')
        setSigner(null)
      }
    },
    [walletProvider, address, open, loadUserData],
  )

  /**
   * Handle wallet disconnection
   *
   * Cleans up all wallet-related state and localStorage data:
   * - Removes authentication token
   * - Removes saved points and votes
   * - Resets all state to initial values
   * - Disconnects from Reown AppKit
   *
   * LOCALSTORAGE CLEANUP:
   * - {address}: Authentication token
   * - points_{address}: Cached points balance
   * - votes_{address}: Draft vote allocations
   */
  const disconnectWeb3 = useCallback(async () => {
    if (address) {
      // Clean up localStorage for this address
      localStorage.removeItem(address) // Auth token
      localStorage.removeItem(`points_${address}`) // Cached points
      localStorage.removeItem(`votes_${address}`) // Draft votes
    }

    // Reset all state to initial values
    setAddressDetails('none')
    setWalletStatus('disconnected')
    setPoap(false)
    setSigner(null)
    setPoints(0)
    setVotes({})

    // Disconnect from Reown AppKit
    await disconnect()
  }, [address, disconnect])

  // ============================================================================
  // WALLET EVENT LISTENERS
  // ============================================================================

  /**
   * Set up event listeners for wallet provider events
   *
   * Handles:
   * - accountsChanged: User switches account in wallet
   * - disconnect: User disconnects wallet
   *
   * IMPORTANT:
   * - When user switches accounts, we reload the page for a clean state
   * - This ensures no data from the previous account persists
   *
   * CUSTOMIZATION:
   * - If you prefer not to reload on account change, you can call loadWeb3('click')
   *   instead of window.location.reload() to re-authenticate with new account
   */
  useEffect(() => {
    if (!walletProvider) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = walletProvider as any

    /**
     * Handle account switching in wallet
     * Reloads the page to ensure clean state with new account
     */
    const handleAccountsChanged = () => {
      window.location.reload()
    }

    /**
     * Handle wallet disconnection
     * Cleans up all stored data and resets state
     */
    const handleDisconnect = () => {
      if (address) {
        localStorage.removeItem(address)
        localStorage.removeItem(`points_${address}`)
        localStorage.removeItem(`votes_${address}`)
      }
      setAddressDetails('none')
      setWalletStatus('disconnected')
      setPoap(false)
      setSigner(null)
      setPoints(0)
      setVotes({})
    }

    // Add event listeners if provider supports them
    if (provider.on) {
      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('disconnect', handleDisconnect)
    }

    // Cleanup listeners on unmount
    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged)
        provider.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [walletProvider, address])

  // ============================================================================
  // AUTO-AUTHENTICATION ON WALLET CONNECTION
  // ============================================================================

  /**
   * Auto-trigger authentication after wallet connects
   *
   * This effect automatically initiates the authentication flow when:
   * 1. User connects their wallet
   * 2. Page loads with wallet already connected
   *
   * Uses a ref to ensure authentication only happens once per connection
   * to prevent multiple signature requests.
   *
   * FLOW:
   * - If token exists in localStorage: Load user data without re-signing
   * - If no token exists: Request signature (only if user just connected, not on page load)
   */
  const authTriggeredRef = useRef(false)

  useEffect(() => {
    // Wait for wallet to be connected
    if (!isConnected || !walletProvider || !address) {
      authTriggeredRef.current = false
      return
    }

    // Already authenticated
    if (walletStatus === 'connected') {
      return
    }

    const existingToken = localStorage.getItem(address)
    if (existingToken) {
      // Token already exists - just load data without re-signing
      if (!authTriggeredRef.current) {
        authTriggeredRef.current = true
        void loadWeb3('load')
      }
      return
    }

    // No token exists - request signature (user just connected)
    if (!authTriggeredRef.current) {
      authTriggeredRef.current = true
      void loadWeb3('click')
    }
  }, [isConnected, walletProvider, address, walletStatus, loadWeb3])

  /**
   * Sync points state with addressDetails.score when data loads from API
   * This effect updates the points display when user data is fetched from the backend
   */
  useEffect(() => {
    if (addressDetails !== 'none' && typeof addressDetails === 'object') {
      // Set points from backend score data
      setPoints(addressDetails.score)
    }
  }, [addressDetails])

  /**
   * Sync wallet status when connection state changes
   *
   * Ensures state is reset when wallet disconnects externally
   * (e.g., user disconnects from wallet extension)
   */
  useEffect(() => {
    if (!isConnected && walletStatus !== 'disconnected') {
      setWalletStatus('disconnected')
      setAddressDetails('none')
      setPoap(false)
      setSigner(null)
      setPoints(0)
      setVotes({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  // ============================================================================
  // PHASE RENDERING
  // ============================================================================

  /**
   * Render the appropriate phase component based on phaseView state
   *
   * PHASE COMPONENTS:
   * - Phase1: Nomination phase (no wallet required)
   * - Phase2: Voting phase (requires wallet connection)
   * - Phase3: Results phase (optional wallet for POAP claim)
   * - Pause: Transition phase between active phases
   *
   * CUSTOMIZATION:
   * - Change initial phase in src/config.tsx under phases.initial
   * - Customize each phase component in src/components/Phase1, Phase2, Phase3
   * - Phase switching can be triggered by countdown completion or manually via setPhaseView
   *
   * STATE PASSING:
   * - Each phase receives only the props it needs
   * - setPhaseView allows countdown components to trigger phase transitions
   * - Wallet-related props only passed to Phase2 and Phase3
   */
  const renderPhase = () => {
    switch (phaseView) {
      case '1':
        // Phase 1: Nomination - No wallet needed
        return <Phase1 setPhaseView={setPhaseView} />

      case '2':
        // Phase 2: Voting - Requires wallet connection
        return (
          <Phase2
            loadWeb3={loadWeb3} // Function to connect wallet
            disconnectWeb3={disconnectWeb3} // Function to disconnect wallet
            signer={signer} // Ethers.js signer for transactions
            address={address || ''} // Connected wallet address
            addressDetails={addressDetails} // User's voting data from backend
            walletStatus={walletStatus} // Current wallet connection status
            points={points} // Remaining vote credits
            setPoints={setPoints} // Function to update points
            votes={votes} // Current vote allocations
            setVotes={setVotes} // Function to update votes
            setPhaseView={setPhaseView} // Function to switch phases
          />
        )

      case 'p':
        // Pause: Transition phase between active phases
        return <Pause />

      case '3':
      default:
        // Phase 3: Results - Wallet optional for POAP claim
        return (
          <Phase3
            loadWeb3={loadWeb3} // Function to connect wallet
            disconnectWeb3={disconnectWeb3} // Function to disconnect wallet
            address={address || ''} // Connected wallet address
            addressDetails={addressDetails} // User's voting data from backend
            walletStatus={walletStatus} // Current wallet connection status
            poap={poap} // POAP eligibility status
          />
        )
    }
  }

  return renderPhase()
}
