# DAO Drops Client

A decentralized retroactive funding platform built with Next.js, enabling communities to nominate, vote, and distribute funding to deserving Ethereum ecosystem projects and individuals through a transparent three-phase process.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [Configuration](#configuration)
- [Customization Guide](#customization-guide)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Backend API Requirements](#backend-api-requirements)
- [Development Scripts](#development-scripts)
- [Troubleshooting](#troubleshooting)

## Features

- **📝 Phase 1 - Nomination**: Community-driven project nominations with form validation and Google reCAPTCHA protection
- **🗳️ Phase 2 - Allocation**: Web3-enabled point distribution system where connected wallets allocate voting credits to nominated projects
- **🏆 Phase 3 - Results**: Transparent leaderboard displaying funding distribution and POAP reward claims for participants
- **🔐 Web3 Wallet Integration**: Seamless wallet connection via Reown AppKit (formerly WalletConnect) with support for multiple networks
- **📱 Responsive Design**: Fully responsive UI with custom breakpoints optimized for all device sizes
- **⏱️ Countdown Timers**: Real-time countdown displays with automatic phase transitions based on configured dates
- **💾 Real-time Vote Tracking**: Live vote updates with localStorage persistence for draft votes
- **🎨 Customizable Theming**: Comprehensive styling system via TailwindCSS and custom CSS variables
- **📚 Comprehensive Documentation**: Every file includes detailed inline comments explaining functionality, customization points, and integration details

## How It Works

### Phase 1 - Nomination

Users submit nominations for projects or individuals deserving retroactive funding for their contributions to the Ethereum ecosystem. Each nomination includes:

- Project/individual name
- Detailed reasoning for funding
- Website link (optional)
- Contact information for verification (email, Twitter, or Discord)

Form submissions are protected by Google reCAPTCHA and sent to the backend API for review.

### Pause Phase

A transition period between phases where users are informed to check back for the next phase. Displays social media links and upcoming announcements.

### Phase 2 - Allocation

Connected wallet users distribute allocated vote credits among nominated projects:

1. **Connect Wallet**: Users connect via Reown AppKit and sign an authentication message
2. **Receive Points**: Backend assigns vote credits based on user eligibility
3. **Distribute Votes**: Users allocate points across projects using increment/decrement controls
4. **Submit Votes**: Final vote distribution is submitted to the backend via authenticated API call

Vote state is persisted in localStorage to preserve draft allocations.

### Phase 3 - Results

The final phase displays:

- **Leaderboard**: Ranked list of projects with total points received
- **Funding Distribution**: Calculated USDC amounts based on total funding pool and point percentages
- **POAP Rewards**: Connected users who participated can claim commemorative POAP NFTs
- **Voting History**: Users can see which projects they supported

All wallet interactions use Reown AppKit with web3-token authentication. See [Architecture → Wallet Integration Flow](#wallet-integration-flow) for detailed authentication process.

## Tech Stack

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router for server and client rendering
- **[React 19](https://react.dev/)** - UI component library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Reown AppKit](https://reown.com/appkit)** - Web3 wallet connection library (formerly WalletConnect)
- **[Ethers.js v6](https://docs.ethers.org/)** - Ethereum library for wallet interactions

### State & Data Management

- **[Axios](https://axios-http.com/)** - HTTP client for API requests

### Additional Libraries

- **[React Countdown](https://www.npmjs.com/package/react-countdown)** - Countdown timer components
- **[React Google reCAPTCHA](https://www.npmjs.com/package/react-google-recaptcha)** - Google reCAPTCHA integration
- **[web3-token](https://www.npmjs.com/package/web3-token)** - Web3 authentication token generation
- **[React Jazzicon](https://www.npmjs.com/package/react-jazzicon)** - Ethereum address identicons

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Project Structure

```
client/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Home page (main app entry)
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── globals.css               # Global styles & Tailwind directives
│   │   ├── fonts.css                 # Font-face declarations
│   │   ├── terms/                    # Terms & Conditions page
│   │   └── favicon.svg               # App favicon
│   │
│   ├── components/                   # React components
│   │   ├── Phase1/                   # Phase 1 components
│   │   │   ├── index.tsx            # Main Phase1 component
│   │   │   └── NominatePopup.tsx    # Nomination form popup
│   │   ├── Phase2/                   # Phase 2 components
│   │   │   ├── index.tsx            # Main Phase2 component
│   │   │   ├── Header.tsx           # Phase2 header with wallet
│   │   │   ├── Project.tsx          # Project card with voting
│   │   │   ├── ProjectPopup.tsx     # Project details popup
│   │   │   └── DonePopup.tsx        # Success confirmation
│   │   ├── Phase3/                   # Phase 3 components
│   │   │   ├── index.tsx            # Main Phase3 component
│   │   │   ├── Header.tsx           # Phase3 header
│   │   │   ├── Project.tsx          # Leaderboard project card
│   │   │   └── ProjectPopup.tsx     # Project results popup
│   │   ├── Pause/                    # Pause phase component
│   │   ├── Terms/                    # Terms & Conditions content
│   │   └── ErrorPopup.tsx            # Error notification popup
│   │
│   ├── context/                      # React Context providers
│   │   └── Reown.tsx                 # Reown AppKit configuration
│   │
│   ├── types/                        # TypeScript definitions
│   │   ├── types.ts                  # App-wide type definitions
│   │   └── assets.d.ts               # Asset module declarations
│   │
│   ├── config.tsx                    # 🔧 Main configuration file
│   └── utils.ts                      # Utility functions
│
├── public/                           # Static assets
│   ├── assets/
│   │   ├── fonts/                    # Custom font files (woff, woff2)
│   │   ├── icons/                    # SVG icons
│   │   ├── logos/                    # Brand logos
│   │   ├── particles/                # Decorative elements
│   │   ├── phase1/                   # Phase 1 backgrounds/assets
│   │   ├── phase2/                   # Phase 2 backgrounds/assets
│   │   ├── phase3/                   # Phase 3 assets (POAP images)
│   │   └── video/                    # Background videos
│   ├── favicon.svg                   # Site favicon
│   └── metaimage-*.{jpg,png}         # Social sharing images
│
├── tailwind.config.ts                # 🎨 Tailwind configuration
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.mjs                 # ESLint configuration
├── postcss.config.js                 # PostCSS configuration
├── package.json                      # Dependencies & scripts
└── README.md                         # This file
```

### Key Files

- **`src/config.tsx`** - ⭐ Single source of truth for all app configuration (API endpoints, phase timing, content text, styling constants)
- **`src/app/globals.css`** - Global styles, custom components, and Tailwind utilities
- **`tailwind.config.ts`** - Theme customization (colors, fonts, breakpoints)
- **`src/types/types.ts`** - TypeScript interfaces for props and data structures

### 📖 Code Documentation

**Every file in this codebase is fully documented** with comprehensive inline comments to make forking and customization as easy as possible. Each file includes:

- **Purpose & Features**: Clear explanation of what the file does
- **Customization Points**: Specific instructions on how to customize behavior, styling, and content
- **State Management**: Detailed documentation of all state variables and their purposes
- **Function Documentation**: Explanation of what each function does and how to use it
- **Backend Requirements**: API endpoint specifications where applicable
- **Code Examples**: Usage examples and patterns

Simply open any file and read the comments to understand how it works and how to customize it for your needs. All customizable text, colors, and behavior are clearly marked with `CUSTOMIZATION:` comments pointing to `src/config.tsx` or the relevant configuration file.

## 🚀 Quick Start Guide

This guide will take you from forking the repository to running your own customized DAO Drops instance in ~30 minutes.

### Step 1: Fork & Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/DAO-Drops.git
cd DAO-Drops/client
```

### Step 2: Install Dependencies

```bash
npm install
```

**Requirements:** Node.js 18+ and npm

### Step 3: Get Required API Keys

Before you can run the app, you need:

1. **WalletConnect Project ID**
   - Visit [Reown Cloud](https://cloud.reown.com)
   - Create a new project
   - Copy your Project ID

2. **Google reCAPTCHA Site Key**
   - Visit [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Register a new site (reCAPTCHA v2)
   - Copy your Site Key

3. **Backend API** (see [Backend API Requirements](#backend-api-requirements))
   - Deploy your own backend or use an existing one
   - Note the API base URL

### Step 4: Configure Environment Variables

Create a `.env.local` file in the `client/` directory with your API keys (see [Deployment → Environment Variables](#environment-variables) for complete details):

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://your-api.herokuapp.com
NEXT_PUBLIC_CAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

**Important:** Replace all placeholder values with your actual keys.

### Step 5: Customize Your App

Open `src/config.tsx` and update these essential settings:

1. **Initial Phase**: Set `phases.initial` to `'1'`, `'2'`, `'3'`, or `'p'` (pause)
2. **Phase Dates**: Update `phase1End` and `phase2End` to your timeline
3. **API URL**: Set `apiEndpoints.baseUrl` to your backend URL
4. **Branding**: Update `appMetadata.title` and `description`
5. **Links**: Update `externalLinks` for your social media
6. **Funding**: Set `appConfig.totalFundingPool` for Phase 3 calculations

**See [Configuration](#configuration) for complete customization options and examples.**

### Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see Phase 1 (or whichever phase you set as initial).

### Step 7: Test Each Phase

#### Testing Phase 1 - Nominations

1. Click "Nominate Them" button
2. Fill out the nomination form
3. Complete reCAPTCHA
4. Submit (check your backend receives the POST request)

#### Testing Phase 2 - Voting

1. In `src/config.tsx`, change `phases.initial` to `'2'`
2. Refresh the page
3. Click "Connect Wallet"
4. Approve wallet connection and sign the authentication message
5. Allocate points to projects using +/- buttons
6. Click "Submit" to send votes to backend

**Note:** Your backend must return vote credits for the connected wallet address.

#### Testing Phase 3 - Results

1. In `src/config.tsx`, change `phases.initial` to `'3'`
2. Refresh the page
3. View the leaderboard with project rankings
4. Connect wallet to claim POAP (if eligible)

**Tip:** Use different wallet addresses to test different user scenarios.

### Step 8: Customize Styling (Optional)

**Quick theme changes:**

1. **Colors:** Edit `tailwind.config.ts` → `colors` section
2. **Fonts:** Add fonts to `public/assets/fonts/`, declare in `src/app/fonts.css`, update `tailwind.config.ts`
3. **Backgrounds:** Replace images in `public/assets/phase1/`, `phase2/`, `phase3/`
4. **Logo:** Replace `public/assets/logos/logo.svg` and `public/favicon.svg`

**See [Customization Guide](#customization-guide) for detailed styling instructions.**

### Step 9: Build for Production

```bash
# Test production build locally
npm run build
npm run start

# Open http://localhost:3000 to verify
```

### Step 10: Deploy

**Netlify (Recommended):**

1. Push your changes to GitHub
2. Go to [Netlify](https://netlify.com) → "New site from Git"
3. Connect your repository
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Add environment variables (same as `.env.local`)
7. Deploy!

**Update `NEXT_PUBLIC_APP_URL` in Netlify environment variables to your production URL.**

See [Deployment](#deployment) for Docker and other hosting options.

---

### 🎯 Next Steps

- **Customize Content:** Edit all text in `src/config.tsx` → `contentText` (see [Configuration](#configuration))
- **Add Your Branding:** Replace logos, colors, and fonts (see [Customization Guide](#customization-guide))
- **Setup Backend:** Implement required API endpoints (see [Backend API Requirements](#backend-api-requirements))
- **Go Live:** Set real phase dates and deploy (see [Deployment](#deployment))

### 🆘 Need Help?

- **Wallet issues?** See [Troubleshooting → Wallet Won't Connect](#wallet-wont-connect)
- **API errors?** See [Troubleshooting → API Errors](#api-errors)
- **Build fails?** See [Troubleshooting → Build Errors](#build-errors)

---

## Configuration

All application configuration is centralized in **`src/config.tsx`** for easy customization. This file is organized into clearly labeled sections:

### 1. Wallet & Network Configuration

```typescript
// WalletConnect Project ID from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Supported blockchain networks (first is default)
export const networks = [mainnet]
```

### 2. API Endpoints

```typescript
export const apiEndpoints = {
  baseUrl: 'https://your-api.herokuapp.com',
  posts: `${API_BASE_URL}/posts`,
  picks: `${API_BASE_URL}/posts/picks/`,
  score: `${API_BASE_URL}/posts/score/`,
}
```

**Update the `API_BASE_URL` to point to your backend API.**

### 3. Phase Configuration

```typescript
export const phases = {
  // Initial phase to display: '1', '2', '3', or 'p' (pause)
  initial: '3',

  // Phase end dates (ISO 8601 with timezone)
  phase1End: '2026-01-01T00:00:00.000+00:00',
  phase2End: '2027-01-01T00:00:00.000+00:00',
}
```

The app automatically transitions to pause mode when countdown reaches zero.

### 4. External Links

```typescript
export const externalLinks = {
  faq: 'https://your-faq-url.com',
  terms: '/terms',
  twitter: 'https://twitter.com/your_account',
  github: 'https://github.com/your-org/your-repo',
  // ... more links
}
```

### 5. App Metadata & Branding

```typescript
export const appMetadata = {
  title: 'DAO Drops v1',
  description: 'We made it rain for you too!',
  baseUrl: process.env.NEXT_PUBLIC_APP_URL,
  images: {
    favicon: '/favicon.svg',
    openGraph: '/metaimage-fb-3.jpg',
    twitter: '/metaimage-twitter-3.jpg',
  },
}
```

These values are used for SEO and social media sharing.

### 6. Authentication Configuration

```typescript
export const authConfig = {
  signMessage: 'This is a signed message',
  tokenExpiration: '5y', // Options: s, m, h, d, y
}
```

### 7. Content Text & Labels

All UI text is configurable in the `contentText` object:

```typescript
export const contentText = {
  phase1: {
    hero: 'something big is about to drop.',
    ctaButton: 'Nominate Them',
    // ... all Phase 1 text
  },
  phase2: {
    heroConnected: 'You are now part of the DAO',
    submitButton: 'Submit',
    // ... all Phase 2 text
  },
  phase3: {
    hero: 'we made it rain for you too! ☔',
    // ... all Phase 3 text
  },
  // ... more sections
}
```

**Customize all text without touching component files.**

### 8. Wallet Connection Metadata

```typescript
export const walletMetadata = {
  name: 'DAO Drops v1',
  description: 'We made it rain for you too!',
  icons: ['/favicon.svg'],
  theme: {
    mode: 'light',
    accentColor: '#000000',
  },
}
```

### 9. Funding Pool Configuration

```typescript
export const appConfig = {
  totalFundingPool: 250000, // USD amount for Phase 3 calculations
  projectColors: {
    colors: ['p-orange', 'p-green', 'p-pink', 'p-blue'],
    pattern: [0, 1, 2, 3, 1, 2, 3, 0, 2, 3, 0, 1, 3, 0, 1, 2],
  },
}
```

### 10. Asset Paths

```typescript
export const assetPaths = {
  logo: '/assets/logos/logo.svg',
  video: {
    mp4: '/assets/video/drops.mp4',
    // ... more formats
  },
  icons: {
    /* ... */
  },
  phase1: {
    /* ... */
  },
  // ... more assets
}
```

Reference assets via these paths for easy updates.

### 11. Technical Configuration

## Customization Guide

### Styling via `src/app/globals.css`

The `globals.css` file contains custom component classes and utilities built on top of Tailwind.

#### Phase Backgrounds

```css
.phase1-bg {
  background:
    url('/assets/phase1/circles.svg') no-repeat center,
    url('/assets/phase1/bg.png') no-repeat center center fixed;
  background-size: cover;
}

.phase2-bg {
  background: url('/assets/phase2/bg.jpg') no-repeat center center;
  background-size: cover;
}
```

Replace background images in `public/assets/phase1/` and `public/assets/phase2/`.

#### Custom Button Styles

```css
.button1 {
  @apply subtitle1 cursor-pointer border-b-8 border-aquaDD pb-5 uppercase transition-transform hover:translate-x-1;
  background-image: url('/assets/icons/arrow-magenta.svg');
  /* ... */
}
```

Buttons use Tailwind's `@apply` for consistency with theme colors.

#### Project Card Color Gradients

```css
.p-orange {
  background: linear-gradient(133.19deg, #ffbdbf 5.69%, #ffd1c0 94.95%);
}
.p-green {
  background: linear-gradient(133.19deg, #80f6cb 5.69%, #38fade 94.95%);
}
.p-pink {
  background: linear-gradient(133.19deg, #ff98e8 5.69%, #fdc0fe 87.98%);
}
.p-blue {
  background: linear-gradient(133.19deg, #53ffff 5.69%, #5bc5ff 94.95%);
}
```

Modify gradient colors to match your brand.

#### Popup Styling

```css
.popup {
  background: url('/assets/phase1/popup-bg.png') no-repeat top;
  background-size: cover;
  width: 1000px;
  box-shadow: 6.5px 2.5px 20px rgba(0, 0, 0, 0.2);
}
```

### Theme via `tailwind.config.ts`

Customize the Tailwind theme to match your brand identity.

#### Color Palette

```typescript
colors: {
  indigoDD: '#3c1dfe',    // Primary brand color
  indigoDD2: '#2713A5',   // Hover state
  aquaDD: '#2bfae1',      // Accent color
  aquaDD2: '#14CDB7',     // Accent hover
  magentaDD: '#ff6ce1',   // Secondary accent
  // ... add your own colors
}
```

These colors are used throughout the app via Tailwind utilities (e.g., `text-indigoDD`, `bg-aquaDD`).

#### Typography

```typescript
fontFamily: {
  ob: ['obviously', 'Arial', 'sans-serif'],
  obWide: ['obviously-wide', 'Arial', 'sans-serif'],
  ibm: ['IBM Plex Mono', 'monospace'],
}
```

**To use custom fonts:**

1. Add font files to `public/assets/fonts/`
2. Declare `@font-face` in `src/app/fonts.css`
3. Update `fontFamily` in `tailwind.config.ts`

#### Responsive Breakpoints

```typescript
screens: {
  '500px': '500px',
  '600px': '600px',
  '700px': '700px',
  '800px': '800px',
  '1000px': '1000px',
  '1200px': '1200px',
  // Custom height breakpoint
  h870px: { raw: '(max-height: 870px)' },
}
```

Use in components: `className="text-sm 600px:text-base 1000px:text-lg"`

### Asset Customization

#### Replace Logos

- Update `public/assets/logos/logo.svg`
- Update `public/favicon.svg`
- Update social share images in `public/` (metaimage-\*.jpg/png)

#### Background Videos

- Replace files in `public/assets/video/` (provide mp4, ogg, webm for compatibility)
- Update paths in `src/config.tsx` under `assetPaths.video`

#### Phase-Specific Assets

- **Phase 1**: `public/assets/phase1/` (background images, decorative SVGs)
- **Phase 2**: `public/assets/phase2/` (background, decorative elements)
- **Phase 3**: `public/assets/phase3/` (POAP images)

#### Icons

- Add/replace icons in `public/assets/icons/`
- Update paths in `src/config.tsx` under `assetPaths.icons`

## Deployment

### Environment Variables

Before deploying, configure these required environment variables in your hosting platform:

| Variable                               | Description                                                              | Example                          |
| -------------------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Project ID from [Reown Cloud](https://cloud.reown.com)                   | `a1b2c3d4e5f6...`                |
| `NEXT_PUBLIC_APP_URL`                  | Your app's production URL                                                | `https://your-dao.netlify.app`   |
| `NEXT_PUBLIC_API_URL`                  | Backend API endpoint                                                     | `https://your-api.herokuapp.com` |
| `NEXT_PUBLIC_CAPTCHA_SITE_KEY`         | reCAPTCHA site key from [Google](https://www.google.com/recaptcha/admin) | `6LeIxAcTA...`                   |

**Important:** Update `NEXT_PUBLIC_APP_URL` to your production domain after deployment.

### Netlify Deployment

1. **Connect Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 or higher

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add all variables from the table above

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically

### Self-Hosted Deployment

#### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t dao-drops .
docker run -p 3000:3000 --env-file .env.local dao-drops
```

## Architecture

### Component Organization

The app uses a **phase-based architecture** where each phase is a self-contained module:

```
Phase1/
  ├── index.tsx          # Main phase component with state
  ├── NominatePopup.tsx  # Form for nominations

Phase2/
  ├── index.tsx          # Main phase component
  ├── Header.tsx         # Wallet connection UI
  ├── Project.tsx        # Voteable project card
  └── ProjectPopup.tsx   # Detailed project view

Phase3/
  ├── index.tsx          # Main phase component
  ├── Header.tsx         # Wallet display
  ├── Project.tsx        # Results project card
  └── ProjectPopup.tsx   # Results detail view
```

**Shared components:** `ErrorPopup.tsx`, `Terms/`

### State Management

The app uses a hybrid state management approach:

1. **Local State (useState)**
   - Component-specific UI state (popup visibility, form values)
   - Voting interface state (current allocations)

2. **LocalStorage**
   - Wallet authentication tokens (`localStorage.getItem(address)`)
   - Draft vote allocations (`localStorage.getItem(`votes\_${address}`)`)
   - Point balances (`localStorage.getItem(`points\_${address}`)`)

### Wallet Integration Flow

The app uses Reown AppKit (formerly WalletConnect) with web3-token authentication:

1. **Connection**: User clicks "Connect Wallet" → Reown AppKit modal opens
2. **Authorization**: User selects wallet and approves connection
3. **Authentication**:
   - Check localStorage for existing token (keyed by wallet address)
   - If no token exists, request signature via web3-token
   - Store signed token in localStorage (expires in 5 years by default)
4. **API Requests**: Include token in `auth` header for authenticated endpoints
5. **User Data**: Backend validates token and returns vote credits and history
6. **State Persistence**: Vote allocations saved to localStorage (per wallet address)

**Account Changes:** App reloads when user switches accounts (ensures clean state).

**Disconnect:** Clears all localStorage data and resets user state.

### Data Flow

**Projects:**

- Phase 1: No project display (submission only via POST `/posts`)
- Phase 2: Fetched from `/posts/picks/` (curated selection)
- Phase 3: Fetched from `/posts/picks/` with vote totals

**User Data (Authenticated):**

- Vote credits: `GET /posts/score/:address` (with auth header)
- Submit votes: `PATCH /posts/score/:id` (with token in request body)

**Real-time Updates:**

- Countdown checks every second
- Phase transitions automatic when countdown reaches zero

## Backend API Requirements

The frontend expects a backend API with the following endpoints. All endpoints are prefixed with `/posts`.

### GET `/posts/` (Optional)

**Get all submitted projects (not just curated picks)**

- **Authentication**: None required (public endpoint)
- **Use case**: Phase 1 project listing, admin panel
- **Note**: This endpoint is commented out by default in the server implementation. Uncomment in `server/routes/posts.ts` if needed.
- **Response**: Same format as `/posts/picks/`

### GET `/posts/picks/`

**Get all curated projects available for point allocation**

- **Authentication**: None required (public endpoint)
- **Response**: 200 OK
  ```json
  [
    {
      "_id": "...",
      "projectName": "Example Project",
      "projectDescription": "Description...",
      "website": "https://example.com",
      "address": "0x1234...",
      "icon": "https://example.com/logo.png",
      "contact": "email@example.com",
      "contactMethod": "email",
      "currentScore": 0,
      "currentPoints": [],
      "usdcAmount": 1000
    }
  ]
  ```

### GET `/posts/score/:id`

**Get a user's score balance and point allocations**

- **Authentication**: Web3 signed token in `auth` header
- **Parameters**:
  - `:id` - User's wallet address (e.g., `0x1234...`)
- **Headers**:
  ```
  auth: <signed_web3_token>
  ```
- **Response**: 200 OK
  ```json
  {
    "account": "0x1234...",
    "score": 100,
    "picks": [
      { "id": "pick_id_1", "points": 30 },
      { "id": "pick_id_2", "points": 70 }
    ],
    "message": "<signature>",
    "_id": "..."
  }
  ```
- **Errors**:
  - 401 Unauthorized - Invalid signature
  - 404 Not Found - User not found

### POST `/posts/`

**Submit a new project for consideration**

- **Authentication**: reCAPTCHA token in `captcha-token` header
- **Headers**:
  ```
  Content-Type: application/json
  captcha-token: <recaptcha_token>
  ```
- **Body**:
  ```json
  {
    "name": "Project Name",
    "message": "Project description...",
    "address": "0x1234...",
    "link": "https://project.com",
    "contact": "email@example.com",
    "contactMethod": "email",
    "image": "https://logo.png"
  }
  ```
  All fields except `name` and `message` are optional.
- **Response**: 201 Created
  ```json
  {
    "_id": "...",
    "name": "Project Name",
    "message": "Project description..."
  }
  ```
- **Errors**:
  - 422 Unprocessable Entity - Validation failed or reCAPTCHA failed
  - 500 Internal Server Error

### PATCH `/posts/score/:id`

**Update user's point allocations to projects**

- **Authentication**: Web3 signed token in `message` field of body
- **Parameters**:
  - `:id` - MongoDB document ID of the user's score (not wallet address)
- **Body**:
  ```json
  {
    "account": "0x1234...",
    "score": 100,
    "picks": [
      { "id": "pick_id_1", "points": 30 },
      { "id": "pick_id_2", "points": 70 }
    ],
    "message": "<signed_web3_token>"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "_id": "...",
    "account": "0x1234...",
    "score": 100,
    "picks": [
      { "id": "pick_id_1", "points": 30 },
      { "id": "pick_id_2", "points": 70 }
    ],
    "message": "<signature>"
  }
  ```
- **Errors**:
  - 401 Unauthorized - Invalid signature
  - 403 Forbidden - Score mismatch (submitted score doesn't match database)
  - 404 Not Found - Score document not found
  - 422 Unprocessable Entity - Validation failed

### Authentication Details

#### Web3 Authentication (for `/score` endpoints)

Users must sign a message with their wallet. The signature is verified using the `web3-token` library.

**Expected signed statement**: `"This is a signed message"` (configurable in backend `config.ts` → `WEB3_AUTH_CONFIG.EXPECTED_STATEMENT`)

**Authentication methods vary by endpoint:**

- **GET `/posts/score/:id`** - Token in `auth` header:

  ```
  Headers: { auth: <web3-token> }
  ```

- **PATCH `/posts/score/:id`** - Token in `message` field of request body:
  ```json
  Body: {
    "message": "<web3-token>",
    // ... other fields
  }
  ```

**Token Generation Example:**

```typescript
import Web3Token from 'web3-token'

const token = await Web3Token.sign(async (msg) => await signer.signMessage(msg), {
  statement: 'This is a signed message',
  expires_in: '5y',
})
```

See [Architecture → Wallet Integration Flow](#wallet-integration-flow) for complete authentication flow.

#### reCAPTCHA Authentication (for POST `/posts`)

Frontend must include a reCAPTCHA v2 token in the `captcha-token` header. The backend verifies it with Google's API.

### Expected Data Types

See `src/types/types.ts` for full TypeScript definitions:

```typescript
interface Project {
  _id: string
  projectName: string
  projectDescription: string
  website: string
  address: string
  icon: string
  contact?: string
  contactMethod?: string
  currentScore?: number
  currentPoints?: Array<any>
  usdcAmount?: number
}

interface AddressDetails {
  account: string
  score: number
  picks: Array<{ id: string; points: number }>
  message: string
  _id?: string
}
```

## Development Scripts

```bash
# Start development server (localhost:3000)
npm run dev

# Build optimized production bundle
npm run build

# Start production server
npm run start

# Run Next.js linter
npm run lint-next

# Run ESLint with auto-fix
npm run lint-eslint

# Format code with Prettier
npm run format
```

### Linting & Formatting

The project uses ESLint and Prettier for code quality:

- **ESLint**: Configured in `eslint.config.mjs`
- **Prettier**: Configured in package.json with Tailwind plugin
- **Format on save**: Recommended in your editor (VS Code, Cursor)

## Troubleshooting

### Wallet Won't Connect

**Problem:** Wallet connection fails or doesn't trigger signing.

**Solutions:**

- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is valid and matches your environment (localhost vs production)
- Get a new project ID from [Reown Cloud](https://cloud.reown.com)
- Check browser console for error messages
- Ensure wallet extension is installed and unlocked
- Try a different wallet or browser

### API Errors

**Problem:** API requests fail with CORS or network errors.

**Solutions:**

- Verify backend API is running and accessible
- Check `NEXT_PUBLIC_API_URL` in `.env.local` matches your backend
- Ensure backend has CORS configured to allow your frontend domain
- Check backend logs for authentication errors
- Verify API endpoints match those in `src/config.tsx`

### Environment Variables Not Working

**Problem:** App doesn't recognize environment variables.

**Solutions:**

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart dev server after modifying `.env.local`
- Check `.env.local` is in the project root directory (not `src/`)
- Verify no typos in variable names
- In production, set variables in your hosting platform's dashboard

### Build Errors

**Problem:** `npm run build` fails.

**Solutions:**

- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check Node.js version: `node -v` (must be 18+)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

### Fonts Not Loading

**Problem:** Custom fonts don't display.

**Solutions:**

- Verify font files exist in `public/assets/fonts/`
- Check `@font-face` declarations in `src/app/fonts.css`
- Ensure font family names in `tailwind.config.ts` match `fonts.css`
- Check browser console for 404 errors on font files
- Try clearing browser cache
- Verify font file formats (.woff, .woff2) are supported

### Phase Not Displaying

**Problem:** Wrong phase shows or phase doesn't change.

**Solutions:**

- Check `phases.initial` in `src/config.tsx` (should be '1', '2', '3', or 'p')
- Verify phase end dates are in ISO 8601 format with timezone
- Check system time is correct
- Look for countdown completion logs in console
- Clear localStorage: `localStorage.clear()`

### Votes Not Persisting

**Problem:** Vote allocations reset on page refresh.

**Solutions:**

- Check browser allows localStorage
- Verify wallet address is connected (votes are keyed by address)
- Check browser console for localStorage errors
- Try a different browser
- Ensure not in incognito/private mode

### Images Not Loading

**Problem:** Background images or assets don't display.

**Solutions:**

- Verify image files exist in `public/assets/`
- Check file paths in `src/config.tsx` match actual file locations
- Ensure file names are case-sensitive correct
- Check `next.config.ts` doesn't block image domains
- Look for 404 errors in browser network tab
