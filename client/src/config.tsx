/**
 * ================================================================================================
 * APP CONFIGURATION
 * ================================================================================================
 *
 * This file contains all configurable values for the application.
 * When forking this app, update the values below to customize it for your own use case.
 *
 * Sections:
 * 1. Wallet & Network Configuration
 * 2. API Endpoints
 * 3. Phase Configuration
 * 4. External Links
 * 5. App Metadata & Branding
 * 6. Authentication Configuration
 * 7. Text Content & Labels
 * 8. Wallet Connect Configuration
 * 9. Funding & Display Configuration
 * 10. Asset Paths
 */

import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

// ================================================================================================
// 1. WALLET & NETWORK CONFIGURATION
// ================================================================================================

/**
 * WalletConnect Project ID
 * Get your own projectId from https://cloud.reown.com
 * The default value is a public projectId only for use on localhost
 */
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694' // this is a public projectId only to use on localhostt

if (!projectId) {
  throw new Error('Project ID is not defined')
}

/**
 * Blockchain networks to support
 * Add or remove networks as needed. First network is the default.
 */
export const networks = [mainnet] as [AppKitNetwork, ...AppKitNetwork[]]

/**
 * Ethers adapter for wallet connections
 */
export const ethersAdapter = new EthersAdapter()

// ================================================================================================
// 2. API ENDPOINTS
// ================================================================================================

/**
 * Backend API base URL
 * Update this to point to your own backend API
 * If you are using localhost, use http://localhost:5000
 * If you are using a deployed backend, use https://your-api.herokuapp.com
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dao-drops.herokuapp.com'

/**
 * All API endpoints used in the application
 * Modify these if your backend has different endpoint structures
 */
export const apiEndpoints = {
  baseUrl: API_BASE_URL,
  // Project nominations and picks
  posts: `${API_BASE_URL}/posts`,
  picks: `${API_BASE_URL}/posts/picks/`,
  // User scores and voting data
  score: `${API_BASE_URL}/posts/score/`,
} as const

// ================================================================================================
// 3. PHASE CONFIGURATION
// ================================================================================================

/**
 * Application phases configuration
 *
 * The app has 3 main phases:
 * - Phase 1: Nomination phase - users nominate projects
 * - Phase 2: Allocation phase - users vote/allocate points
 * - Phase 3: Results phase - display final results and rewards
 * - Pause: Transition period between phases
 *
 * Phase values: '1', '2', '3', 'p' (pause)
 */
export const phases = {
  /**
   * Initial phase to display when app loads
   * Options: '1', '2', '3', 'p'
   */
  initial: '2',

  /**
   * Phase 1 end date (ISO 8601 format with timezone)
   * When this date is reached, the app transitions to pause mode
   */
  phase1End: '2026-01-01T00:00:00.000+00:00',

  /**
   * Phase 2 end date (ISO 8601 format with timezone)
   * When this date is reached, the app transitions to pause mode
   */
  phase2End: '2027-01-01T00:00:00.000+00:00',
} as const

// ================================================================================================
// 4. EXTERNAL LINKS
// ================================================================================================

/**
 * External links used throughout the application
 * Update these to point to your own social media, documentation, etc.
 */
export const externalLinks = {
  // Help & Documentation
  faq: 'https://hackmd.io/pXkFyZ8WQA-BGedKeHqHPg?view',
  terms: '/terms',

  // Social Media
  twitter: 'https://twitter.com/dao_drops',
  github: 'https://github.com/dOrgTech/DAO-Drops',

  // Partner & Attribution Links
  dOrg: 'https://www.dorg.tech',
  ethereumFoundation: 'https://ethereum.foundation',

  // Rewards & NFTs
  poap: 'https://www.poap.delivery/dao-drops-round-1',

  // App URLs
  mainSite: 'https://daodrops.io',
  etherscan: 'https://etherscan.io',
} as const

// ================================================================================================
// 5. APP METADATA & BRANDING
// ================================================================================================

/**
 * Application metadata for SEO, social sharing, and branding
 * These values are used in the HTML head and Open Graph tags
 */
export const appMetadata = {
  /**
   * App title - appears in browser tab and social shares
   */
  title: 'DAO Drops v1',

  /**
   * App description for SEO and social shares
   */
  description: 'We made it rain for you too!',

  /**
   * Base URL of your deployed application
   * Used for canonical URLs and Open Graph tags
   */
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://v1.daodrops.io',

  /**
   * Social sharing images
   * These should be absolute paths from the public directory
   */
  images: {
    favicon: '/favicon.svg',
    openGraph: '/metaimage-fb-3.jpg',
    twitter: '/metaimage-twitter-3.jpg',
  },
} as const

// ================================================================================================
// 6. AUTHENTICATION CONFIGURATION
// ================================================================================================

/**
 * Web3 authentication settings
 * Configure how users authenticate with their wallets
 */
export const authConfig = {
  /**
   * Message shown to users when signing
   * This is displayed in their wallet when they need to sign a message
   */
  signMessage: 'This is a signed message',

  /**
   * How long authentication tokens are valid
   * Format: '<number><unit>' where unit can be: s (seconds), m (minutes), h (hours), d (days), y (years)
   */
  tokenExpiration: '5y',
} as const

// ================================================================================================
// 7. TEXT CONTENT & LABELS
// ================================================================================================

/**
 * Customizable text content used throughout the application
 * Update these to match your own branding and messaging
 */
export const contentText = {
  /**
   * Attribution text shown in footer and sidebars
   */
  attribution: {
    builtBy: 'dOrg',
    supportedBy: 'Ethereum Foundation',
  },

  /**
   * Google reCAPTCHA site key for form protection
   * Get your own key from https://www.google.com/recaptcha/admin
   */
  captchaSiteKey: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY || '',

  /**
   * URLs embedded in Terms & Conditions text
   * These appear as links within the legal text
   */
  termsUrls: {
    dorgSite: 'https://dorg.tech',
    daoDropsSite: 'https://daodrops.io',
    privacyPolicy: 'https://www.dorg.tech/#/privacy-policy',
    erc20Spec: 'https://github.com/ethereum/EIPs/issues/20',
  },

  /**
   * Phase 1 - Nomination Phase Text
   */
  phase1: {
    hero: 'something big is about to drop.',
    subtitle: 'know a project or someone deserving?',
    ctaButton: 'Nominate Them',
    phaseLabel: 'nomination phase:',
    nominationFormTitle:
      'Hello! Please nominate a project or individual that you think should receive retroactive funding for their contributions to the Ethereum Ecosystem. For more info on eligibility, you can see the',
    successTitle: 'Awesome!',
    successSubtitle: 'Nomination done.',
    successMessage: 'Stay tuned for the next phase in:',
    socialCallout: 'DAO drops twitter',
  },

  /**
   * Phase 2 - Allocation Phase Text
   */
  phase2: {
    phaseLabel: 'allocation phase:',
    heroConnected: 'You are now part of the DAO',
    heroSubtitle: 'Drop your points and make it rain ☔ ️',
    heroDisconnected: 'Connect your wallet',
    heroDisconnectedSubtitle: 'To drop your points and make it rain ☔',
    ctaButton: 'Drop Points',
    toPlayLabel: 'To Play',
    connectWalletButton: 'Connect Wallet',
    howToTitle: 'HOW TO DROP POINTS',
    howToDescription:
      'Distribute your points in the projects you think should receive funding.\nOnce you are finished, press submit to send them.',
    yourDropsTitle: 'YOUR DROPS',
    otherNomineesTitle: 'OTHER NOMINEES',
    loadingProjects: 'Loading Projects...',
    loadingDrops: 'Loading Your Drops...',
    loadingOtherNominees: 'Loading Other Nominees...',
    voteCredits: 'Vote Credits',
    submitButton: 'Submit',
    sendingButton: 'Sending...',
    sentButton: 'Points Sent',
    doneButton: 'Done',
    sendPointsButton: 'Send Points',
    termsAgreement: 'By submitting you agree to',
    termsLink: 'terms and conditions',
    distributeAllPoints: 'Distribute all your points to submit!',
    allPointsSent: 'All your points were sent!',
    noPointsMessage:
      "Oh we are sorry! It seems that you don't have any points. You can try another wallet or try next time.",
    walletConnected: 'Your wallet is connected',
    signedInAs: 'Signed in as:',
    disconnect: 'Disconnect',
    successTitle: 'Awesome!',
    successSubtitle: 'Your points were submitted.',
    successMessage: 'Stay tuned for the next phase in:',
    socialCallout: 'DAO drops twitter',
  },

  /**
   * Phase 3 - Results Phase Text
   */
  phase3: {
    phaseLabel: 'LAST PHASE',
    rewardsTitle: 'REWARDS',
    hero: 'we made it rain for you too! ☔',
    checkRewardsButton: 'Check Rewards',
    checkResultsButton: 'Check Results',
    leaderboardTitle: 'LEADER BOARD RESULTS',
    leaderboardDescription:
      'Each project will receive funds in proportion to the points they were given.\nThanks for being part of DAO drops community and helping other projects to grow!',
    participatedMessage: 'If you participated as an allocator you have a reward!',
    checkLeaderboardMessage: 'You can check the leader board results below.',
    poapClaimTitle: 'Awesome! You can claim the DAO drops POAP',
    claimButton: 'Claim',
    noRewardsMessage: "You don't have any rewards to claim but be sure to participate on the next Dao Drops round!",
    pointsReceived: 'Points Received',
    loadingProjects: 'Loading Projects...',
  },

  /**
   * Pause Phase Text
   */
  pause: {
    hero: 'stay tuned',
    message: 'check back here soon to see the results of the distribution. follow us on',
    socialCallout: 'DAO drops twitter',
    announcement: 'to see the announcement.',
  },

  /**
   * Common UI Text
   */
  common: {
    viewDetails: 'view details',
    voted: 'VOTED',
    projectLink: 'Project Link:',
    faq: 'FAQ',
    ptsLabel: 'pts',
    termsTitle: 'Terms & Conditions',
  },

  /**
   * Form Labels & Placeholders (Phase 1 Nomination)
   */
  forms: {
    nominationForm: {
      projectNameLabel: 'Project / individual name (yes, you can nominate yourself)',
      reasonLabel: 'Why should they receive the funding? Tell us more!',
      charLeft: 'Char Left',
      websiteLabel: 'Link to website (optional)',
      contactLabel: 'Contact of project / individual (for verification)',
      contactMethods: {
        email: 'email',
        twitter: 'twitter',
        discord: 'discord',
      },
      placeholders: {
        email: 'example@example.com',
        twitter: '@example',
        discord: 'Example#3456',
      },
      termsCheckbox: 'I agree to the',
      submitButton: 'Submit',
    },
  },

  /**
   * Error Messages
   */
  errors: {
    genericTitle: "We've encountered an issue!",
    genericMessage: 'Please refresh your page and try again in a few minutes.',
  },
} as const

// ================================================================================================
// 8. WALLET CONNECT CONFIGURATION
// ================================================================================================

/**
 * Wallet connection metadata
 * This information is shown when users connect their wallets
 */
export const walletMetadata = {
  /**
   * Application name shown in wallet connection dialogs
   */
  name: 'DAO Drops v1',

  /**
   * Application description shown in wallet connection dialogs
   */
  description: 'We made it rain for you too!',

  /**
   * Application icons shown in wallet connection dialogs
   * Array of icon paths (absolute URLs or paths from public directory)
   */
  icons: ['/favicon.svg'],

  /**
   * Wallet theme configuration
   */
  theme: {
    /**
     * Theme mode: 'light' or 'dark'
     */
    mode: 'light' as const,

    /**
     * Accent color for wallet UI (hex color)
     */
    accentColor: '#000000',
  },
} as const

// ================================================================================================
// 9. FUNDING & DISPLAY CONFIGURATION
// ================================================================================================

/**
 * Application-specific configuration values
 */
export const appConfig = {
  /**
   * Total funding pool amount (in USD)
   * This is used to calculate individual project allocations in Phase 3
   */
  totalFundingPool: 250000,

  /**
   * Project card color scheme
   * Colors cycle through projects in a pattern
   */
  projectColors: {
    colors: ['p-orange', 'p-green', 'p-pink', 'p-blue'],
    // Pattern defines the order colors appear (indexes into colors array)
    pattern: [0, 1, 2, 3, 1, 2, 3, 0, 2, 3, 0, 1, 3, 0, 1, 2],
  },
} as const

// ================================================================================================
// 10. ASSET PATHS
// ================================================================================================

/**
 * Paths to static assets (images, videos, icons)
 * All paths are relative to the /public directory
 * Update these if you move or rename assets
 */
export const assetPaths = {
  /**
   * Logo image
   */
  logo: '/assets/logos/logo.svg',

  /**
   * Background video files
   * Multiple formats provided for browser compatibility
   */
  video: {
    mp4: '/assets/video/drops.mp4',
    ogg: '/assets/video/drops.ogg',
    webm: '/assets/video/drops.webm',
    thumbnail: '/assets/video/drops-thumbnail.jpg',
  },

  /**
   * Icons used throughout the app
   */
  icons: {
    twitter: '/assets/icons/twitter.svg',
    twitter2: '/assets/icons/twitter2.svg',
    github: '/assets/icons/github.svg',
    close: '/assets/icons/close.svg',
    closePng: '/assets/icons/close.png',
    minus: '/assets/icons/minus.svg',
    plus: '/assets/icons/plus.svg',
    heart: '/assets/icons/heart.svg',
  },

  /**
   * Decorative elements and particles
   */
  particles: {
    bubble: '/assets/particles/bubble.png',
  },

  /**
   * Phase 1 specific assets
   */
  phase1: {
    squiggle: '/assets/phase1/squiggle.svg',
    dots: '/assets/phase1/dots.svg',
    dotsSmall: '/assets/phase1/dots-small.svg',
    aquaBox: '/assets/phase1/aqua-box.svg',
  },

  /**
   * Phase 2 specific assets
   */
  phase2: {
    aquaBoxMobile: '/assets/phase2/aqua-box-mobile.svg',
    dots2: '/assets/phase2/dots2.svg',
    dots3: '/assets/phase2/dots3.svg',
    squiggle2: '/assets/phase2/squiggle2.svg',
  },

  /**
   * Phase 3 specific assets
   */
  phase3: {
    poap: '/assets/phase3/poap.png',
    poapSmall: '/assets/phase3/poap-small.png',
  },
} as const
