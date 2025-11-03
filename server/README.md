# DAO Drops Server

A production-ready TypeScript/Express backend for managing project submissions, curated picks, and user point allocations with Web3 wallet authentication.

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [How to Fork This Project](#-how-to-fork-this-project)
- [Quick Start Guide](#-quick-start-guide)
- [Codebase Overview](#-codebase-overview)
- [Configuration & Customization](#-configuration--customization)
- [API Endpoints](#-api-endpoints)
- [Database Seeding](#-database-seeding)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [NPM Scripts Reference](#-npm-scripts-reference)
- [Next Steps](#-next-steps)
- [Support & Resources](#-support--resources)

---

## 🎯 Introduction

This application is a **fully documented, fork-ready backend system** designed for:

1. **Project Submission Phase**: Users submit projects for consideration (with reCAPTCHA spam protection)
2. **Curation Phase**: Admins review and select projects to become "picks"
3. **Allocation Phase**: Users with point balances allocate points to their favorite picks
4. **Results & Export**: Export participant data and point allocations for distribution/rewards

### Use Cases

- **DAO Funding Rounds**: Community members allocate votes/points to projects
- **Grant Programs**: Distribute funding based on community preferences
- **Hackathon Judging**: Track submissions and scoring
- **Community Curation**: Crowdsource project discovery and ranking

---

## ✨ Features

### Security & Authentication

- 🔐 **Web3 Wallet Authentication** - Sign-in with Ethereum wallets using signed messages
- 🤖 **Google reCAPTCHA v2** - Spam protection for project submissions
- 🛡️ **Rate Limiting** - Configurable request limits per IP address
- 🔒 **MongoDB Sanitization** - Protection against NoSQL injection attacks
- 🪖 **Helmet.js** - Security headers for Express

### Data Management

- 📊 **CSV Export** - Export participants, picks, and allocation data
- 🔄 **Database Seeding** - Easy import/export of picks and scores via CLI
- 💾 **MongoDB Integration** - Scalable document storage with Mongoose

### Developer Experience

- 📝 **TypeScript** - Full type safety and excellent IDE support
- 📚 **JSDoc Documentation** - Auto-generated API documentation
- ⚙️ **Centralized Config** - All settings in one file (`config.ts`)
- 🎨 **Inline Comments** - Every file thoroughly documented
- 🧪 **NPM Scripts** - Convenient commands for all operations

---

## 🔄 How It Works

This application implements a complete voting/allocation workflow in four phases:

### Phase 1: Project Submission

1. **User submits a project** via `POST /posts`
2. **Frontend includes reCAPTCHA token** to prevent spam
3. **Backend verifies token** with Google's reCAPTCHA API
4. **Project saved** to `postmessages` collection
5. **Admin reviews** submissions off-chain

```
User Wallet → Frontend Form → reCAPTCHA Verification → MongoDB (postmessages)
```

### Phase 2: Curation

1. **Admin reviews** all submissions in `postmessages` collection
2. **Selected projects** are formatted as picks
3. **Picks imported** to `picks` collection via seeder:
   ```bash
   npm run seed:picks-import
   ```
4. **Picks become available** for point allocation

```
Admin Review → pickData/Picks.json → Seeder Script → MongoDB (picks)
```

### Phase 3: Point Allocation

1. **Admin creates score balances** for eligible participants
2. **Scores imported** via seeder:
   ```bash
   npm run seed:scores-import
   ```
3. **Users connect wallet** and sign authentication message
4. **Users retrieve their balance** via `GET /posts/score/:id`
5. **Users allocate points** to picks via `PATCH /posts/score/:id`
6. **Backend validates**:
   - Web3 signature authenticity
   - Score balance matches database
   - Allocations don't exceed balance
7. **Allocations saved** to database

```
User Wallet → Sign Message → Retrieve Balance → Allocate Points → Verify Signature → Update MongoDB
```

### Phase 4: Results & Distribution

1. **Export participant addresses**:
   ```bash
   npm run seed:scores-export-participants
   ```
2. **Export point allocation data**:
   ```bash
   npm run seed:scores-export-points
   ```
3. **Calculate distributions** using exported CSV files
4. **Execute distributions** (off-chain or on-chain)

```
MongoDB → Export CSV → Calculate Distribution → Distribute Rewards/Tokens
```

### Key Security Features

- **reCAPTCHA**: Prevents spam submissions
- **Web3 Signatures**: Ensures only wallet owners can allocate their points
- **Score Verification**: Prevents users from claiming more points than allocated
- **Rate Limiting**: Protects against API abuse
- **MongoDB Sanitization**: Prevents NoSQL injection attacks

---

## 🛠️ Tech Stack

### Backend Framework

- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express.js](https://expressjs.com/)** - Web application framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Database

- **[MongoDB](https://www.mongodb.com/)** - NoSQL document database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling (ODM)

### Authentication & Security

- **[web3-token](https://github.com/bytesbay/web3-token)** - Web3 wallet authentication library
- **[express-validator](https://express-validator.github.io/)** - Request validation middleware
- **[express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)** - Rate limiting middleware
- **[helmet](https://helmetjs.github.io/)** - Security headers middleware
- **[cors](https://github.com/expressjs/cors)** - Cross-Origin Resource Sharing

### Data Processing

- **[json2csv](https://github.com/zemirco/json2csv)** - JSON to CSV conversion for exports
- **[body-parser](https://github.com/expressjs/body-parser)** - Request body parsing

### Development Tools

- **[tsx](https://github.com/privatenumber/tsx)** - TypeScript execution with watch mode
- **[JSDoc](https://jsdoc.app/)** - API documentation generator
- **[docdash](https://github.com/clenemt/docdash)** - JSDoc documentation theme

### External APIs

- **[Google reCAPTCHA v2](https://www.google.com/recaptcha/)** - Spam protection
- **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** - Cloud database hosting

### Package Manager

- **[npm](https://www.npmjs.com/)** - Node package manager

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                      (React/Next.js)                        │
│                                                             │
│  • Web3 Wallet Connection (MetaMask, WalletConnect)         │
│  • reCAPTCHA Integration                                    │
│  • API Requests                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTP/HTTPS
                  │ (CORS Enabled)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                        │
│                       (This App)                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Middleware Stack                       │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  • CORS Configuration                               │    │
│  │  • Rate Limiting (15 min / 50 requests)             │    │
│  │  • Body Parser (30mb limit)                         │    │
│  │  • MongoDB Sanitization                             │    │
│  │  • Helmet Security Headers                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Route Layer                            │    │
│  │              (routes/posts.ts)                      │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  • /posts/picks/          → GET picks               │    │
│  │  • /posts/score/:id       → GET/PATCH score         │    │
│  │  • /posts/                → POST submission         │    │
│  │  • Request Validation (express-validator)           │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Controller Layer                         │    │
│  │            (controllers/posts.ts)                   │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  • createPost()  → reCAPTCHA verification           │    │
│  │  • getScore()    → Web3 authentication              │    │
│  │  • getPicks()    → Fetch all picks                  │    │
│  │  • updateScore() → Verify & update allocations      │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Model Layer                            │    │
│  │              (models/*.ts)                          │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │  • Picks Schema       → Curated projects            │    │
│  │  • PostMessage Schema → User submissions            │    │
│  │  • Scores Schema      → User balances & allocations │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Database                          │
│                    (MongoDB Atlas)                          │
│                                                             │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│    │   picks      │  │ postmessages │  │  getscores   │     │
│    │              │  │              │  │              │     │
│    │ • Curated    │  │ • User       │  │ • User       │     │
│    │   projects   │  │   submissions│  │   balances   │     │
│    │ • Voteable   │  │ • Pending    │  │ • Point      │     │
│    │   items      │  │   review     │  │   allocations│     │
│    └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘

External Services:
┌─────────────────┐         ┌─────────────────┐
│  Google         │         │  Ethereum       │
│  reCAPTCHA API  │         │  Network        │
│                 │         │                 │
│  • Verify       │         │  • Signature    │
│    tokens       │         │    verification │
└─────────────────┘         └─────────────────┘
```

### Data Flow Patterns

#### Submission Flow

```
User → Frontend → reCAPTCHA Token → POST /posts → Verify Token → Save to DB → Response
```

#### Authentication Flow

```
User → Sign Message with Wallet → Frontend → GET /posts/score/:id
     → Backend verifies signature with web3-token → Return user data
```

#### Allocation Flow

```
User → Select Allocations → Sign Message → PATCH /posts/score/:id
     → Verify signature → Validate balance → Update DB → Response
```

### Configuration Architecture

All configuration is centralized in `config.ts` and imported throughout the application:

```
config.ts
   ├─→ index.ts (Server config, CORS, rate limits)
   ├─→ controllers/posts.ts (HTTP status, errors, captcha, web3)
   ├─→ routes/posts.ts (Routes, validation rules)
   ├─→ pickSeeder.ts (File paths, export fields)
   └─→ scoreSeeder.ts (File paths, export fields)
```

This allows forking the project and customizing all settings in one place.

### Seeder Architecture

Seeders are standalone CLI tools for data management:

```
pickSeeder.ts                      scoreSeeder.ts
├─ Import (-i)                     ├─ Import (-i)
│  └─ pickData/Picks.json          │  └─ scoreData/ScoreSheet.json
│     → MongoDB (picks)            │     → MongoDB (getscores)
│                                  │
├─ Export (-e)                     ├─ Export Participants (-ep)
│  └─ MongoDB (picks)              │  └─ MongoDB (getscores)
│     → pickData/exportedPicks.csv │     → scoreData/exportedAccounts.csv
│                                  │
└─ Delete (-d)                     ├─ Export Point Data (-evp)
   └─ Clear picks collection       │  └─ MongoDB (getscores)
                                   │     → scoreData/exportedPointData.csv
                                   │
                                   ├─ Delete Scores (-d)
                                   │  └─ Clear getscores collection
                                   │
                                   └─ Delete Posts (-dp)
                                      └─ Clear postmessages collection
```

### Security Layers

1. **Transport Layer**: HTTPS (in production)
2. **Application Layer**: CORS, rate limiting, Helmet headers
3. **Authentication Layer**: Web3 signature verification (web3-token)
4. **Validation Layer**: express-validator on all inputs
5. **Database Layer**: MongoDB sanitization, Mongoose schema validation
6. **Business Logic Layer**: Score matching, allocation validation

---

## 🍴 How to Fork This Project

### Step 1: Fork & Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/DAO-Drops.git
cd DAO-Drops/server
```

### Step 2: Review and Customize Configuration

**Before running the app**, open `config.ts` and review all settings:

```bash
# Open the config file in your editor
code config.ts  # or use your preferred editor
```

Key settings to customize:

- `CORS_CONFIG.ORIGIN` - Set to your frontend domain
- `CORS_CONFIG.PRODUCTION_ORIGIN` - Your production domain
- `RATE_LIMIT_CONFIG` - Adjust rate limits for your traffic
- `API_ROUTES` - Change endpoint paths if needed
- `ERROR_MESSAGES` - Customize error messages to match your app's tone
- `SEEDER_CONFIG` - Update file paths if needed

See [Configuration & Customization](#-configuration--customization) for details.

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB connection string (required)
ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# Server port (optional, defaults to 5000)
PORT=5000

# Google reCAPTCHA secret key (required)
CAPTHCA_SECRET_KEY=your_recaptcha_secret_key

# Environment (development or production)
NODE_ENV=development
```

**Get reCAPTCHA keys**: https://www.google.com/recaptcha/admin

### Step 4: Install and Build

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

### Step 5: Ready to Deploy!

See [Quick Start Guide](#-quick-start-guide) and [Deployment](#-deployment) sections.

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** v14 or higher
- **MongoDB Atlas** account (or local MongoDB instance)
- **Google reCAPTCHA** keys ([Get them here](https://www.google.com/recaptcha/admin))

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with required variables
# (See environment variables section above)

# 3. Build TypeScript
npm run build

# 4. Start the server
npm start
```

Server will run on `http://localhost:5000` (or your configured PORT)

### Development Mode

```bash
# Run with auto-reload on file changes (using tsx watch)
npm run dev
```

### Initial Data Setup

See the [Database Seeding](#-database-seeding) section for detailed information about example data files and import procedures.

```bash
# Import initial picks (curated projects)
npm run seed:picks-import

# Import user scores/balances
npm run seed:scores-import
```

### Verify Setup

```bash
# Test the API
curl http://localhost:5000/posts/picks/

# Should return an array of picks
```

---

## 📁 Codebase Overview

### Project Structure

```
server/
├── config.ts                 # 🎛️ All configuration settings (START HERE!)
├── index.ts                  # 🚀 Main server entry point
│
├── controllers/
│   └── posts.ts             # 🎮 Business logic for API endpoints
│
├── routes/
│   └── posts.ts             # 🛣️ API route definitions and validation
│
├── models/
│   ├── picks.ts             # 📊 Curated projects schema (MongoDB)
│   ├── postMessage.ts       # 📝 Project submissions schema
│   └── scores.ts            # 💯 User scores/balances schema
│
├── types/
│   └── index.ts             # 📋 TypeScript type definitions
│
├── pickSeeder.ts            # 🌱 Picks data management script
├── scoreSeeder.ts           # 🌱 Scores data management script
│
├── pickData/
│   └── Picks-Example.json   # 📂 Example picks data
│   # See Database Seeding section for usage
│
├── scoreData/
│   └── ScoreSheet-Example.json  # 📂 Example score data
│   # See Database Seeding section for usage
│
├── dist/                    # 📦 Compiled JavaScript & TypeScript declarations (auto-generated)
│   ├── *.js                 # Compiled JavaScript files
│   ├── *.d.ts               # TypeScript declaration files
│   └── *.js.map             # Source maps for debugging
│
├── docs/                    # 📚 JSDoc HTML documentation (auto-generated)
│   └── index.html           # Documentation home page
│
├── node_modules/            # 📦 Dependencies (auto-installed)
│
├── .env                     # 🔐 Environment variables (create this!)
├── .gitignore               # 🚫 Git ignore rules
├── README.md                # 📖 This documentation file
├── package.json             # 📋 NPM configuration and scripts
├── package-lock.json        # 🔒 Locked dependency versions
├── tsconfig.json            # ⚙️ TypeScript compiler configuration
└── jsdoc.json               # 📖 JSDoc documentation configuration
```

### File Descriptions

#### Core Application Files

**`config.ts`** - **START HERE!**

- All configurable settings in one place
- Server, CORS, rate limiting, routes, validation, error messages
- Fully documented with inline comments
- **Review and customize before deploying**

**`index.ts`** - Server Entry Point

- Express server setup
- Middleware configuration (CORS, rate limiting, body parsing, security)
- MongoDB connection
- Route registration

**`controllers/posts.ts`** - Business Logic

- `createPost()` - Handle project submissions with reCAPTCHA verification
- `getScore()` - Retrieve user scores with Web3 authentication
- `getPicks()` - Get all curated projects
- `updateScore()` - Update user point allocations

**`routes/posts.ts`** - Route Definitions

- API endpoint configuration
- Request validation using express-validator
- Route-to-controller mappings

#### Data Models

**`models/picks.ts`** - Curated Projects Schema

- Projects selected by admins for voting
- Fields: projectName, description, website, address, score, etc.

**`models/postMessage.ts`** - Project Submissions Schema

- User-submitted projects awaiting curation
- Fields: name, message, address, link, contact, etc.

**`models/scores.ts`** - User Scores Schema

- User balances and point allocations
- Fields: account (address), score (balance), picks (allocations), message (signature)

#### Type Definitions

**`types/index.ts`** - TypeScript Interfaces

- `IPostMessageBody` - Project submission data
- `IScoreBody` - Score update data
- Ensures type safety across the application

#### Data Directories

**`pickData/`** - Picks Data Storage

- Input/output files for curated project picks (see [Database Seeding](#-database-seeding) for details)

**`scoreData/`** - Scores Data Storage

- Input/output files for user scores and allocations (see [Database Seeding](#-database-seeding) for details)

#### Database Seeders

**`pickSeeder.ts`** - Picks Management

- Import picks from JSON (`-i`)
- Delete all picks (`-d`)
- Export picks to CSV (`-e`)

**`scoreSeeder.ts`** - Scores Management

- Import scores from JSON (`-i`)
- Delete all scores (`-d`)
- Delete all submissions (`-dp`)
- Export participant addresses (`-ep`)
- Export point allocation data (`-evp`)

See the [Architecture](#️-architecture) section for detailed data flow diagrams.

### Database Collections

Default collection names (configurable in `config.ts`):

- `postmessages` - Project submissions from users
- `picks` - Curated projects selected for voting
- `getscores` - User scores and point allocations

---

## ⚙️ Configuration & Customization

### Using `config.ts`

All application settings are centralized in `config.ts` for easy forking and customization. The file is organized into clearly documented sections:

### Configuration Categories

#### 1. Server Configuration

```typescript
export const SERVER_CONFIG = {
  DEFAULT_PORT: 5000, // Port if PORT env var not set
  REQUEST_BODY_LIMIT: '30mb', // Max request size
}
```

**When to modify**:

- Change port if 5000 is already in use
- Increase body limit for large file uploads

#### 2. CORS Settings

```typescript
export const CORS_CONFIG = {
  ORIGIN: '*', // Allow all origins
  PRODUCTION_ORIGIN: 'https://www.daodrops.io', // Your production domain
}
```

**When to modify**:

- **IMPORTANT**: Set `ORIGIN` to your frontend domain in production!
- Currently set to `'*'` for development convenience
- Example: `ORIGIN: 'https://yourdomain.com'`

#### 3. Rate Limiting

```typescript
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 50, // Max requests per IP
  STANDARD_HEADERS: true, // Return rate limit info
  LEGACY_HEADERS: false,
}
```

**When to modify**:

- Increase `MAX_REQUESTS` for high-traffic applications
- Decrease to be more strict against abuse
- Adjust `WINDOW_MS` for different time windows

#### 4. Google reCAPTCHA

```typescript
export const CAPTCHA_CONFIG = {
  VERIFY_URL: 'https://www.google.com/recaptcha/api/siteverify',
  // Secret key loaded from CAPTHCA_SECRET_KEY env variable
}
```

**When to modify**:

- Usually no changes needed
- Secret key goes in `.env` file, not here

#### 5. Web3 Authentication

```typescript
export const WEB3_AUTH_CONFIG = {
  EXPECTED_STATEMENT: 'This is a signed message',
}
```

**When to modify**:

- Change to match the statement users sign in their wallets
- Must match frontend signing implementation

#### 6. API Routes

```typescript
export const API_ROUTES = {
  POSTS_BASE: '/posts',
  SCORE_ROUTE: '/score/:id',
  PICKS_ROUTE: '/picks/',
  CREATE_POST_ROUTE: '/',
  UPDATE_SCORE_ROUTE: '/score/:id',
}
```

**When to modify**:

- Change base path from `/posts` to something else
- Customize sub-route paths

#### 7. Validation Rules

```typescript
export const VALIDATION_RULES = {
  POST_MESSAGE: {
    NAME: {
      MIN_LENGTH: 5,
      ERROR_MESSAGE: 'Name must have more than 5 characters',
    },
    MESSAGE: {
      ERROR_MESSAGE: 'Message should be a string',
    },
  },
  SCORE_UPDATE: {
    // ... validation rules for score updates
  },
}
```

**When to modify**:

- Adjust field validation requirements
- Change minimum/maximum lengths
- Customize error messages

#### 8. HTTP Status Codes

```typescript
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  GATEWAY_TIMEOUT: 504,
}
```

**When to modify**:

- Rarely needs changes
- Useful if you want different status code conventions

#### 9. Error Messages

```typescript
export const ERROR_MESSAGES = {
  UNAUTHORIZED_USER: 'Anauthorized User',
  SCORE_MISMATCH: 'Submitted score doesnt match DB score for user',
  GENERIC_ERROR: 'An error occurred',
}
```

**When to modify**:

- Customize to match your application's tone
- Translate to other languages
- Add more detailed error messages

#### 10. Database Configuration

```typescript
export const DATABASE_CONFIG = {
  COLLECTIONS: {
    POST_MESSAGES: 'postmessages',
    SCORES: 'getscores',
    PICKS: 'picks',
  },
}
```

**When to modify**:

- Change collection names if desired
- **Note**: If changed, update Mongoose model collection names

#### 11. Data Seeding Configuration

```typescript
export const SEEDER_CONFIG = {
  PICKS: {
    DATA_DIRECTORY: '/pickData',
    INPUT_FILE: 'Picks.json',
    EXPORT_FILE: 'exportedPicks.csv',
    EXPORT_FIELDS: ['projectName', 'projectDescription', ...],
  },
  SCORES: {
    DATA_DIRECTORY: '/scoreData',
    INPUT_FILE: 'ScoreSheet.json',
    PARTICIPANTS_EXPORT_FILE: 'exportedAccounts.csv',
    POINT_DATA_EXPORT_FILE: 'exportedPointData.csv',
    // ... export field configurations
  },
}
```

**When to modify**:

- Change data file locations
- Customize export file names
- Select different fields for CSV exports

#### 12. Console Messages

```typescript
export const CONSOLE_MESSAGES = {
  SERVER: {
    RUNNING: (port: number | string) => `Server running on port: ${port}`,
  },
  SEEDER: {
    PICKS_IMPORTED: 'Picks Imported to Mongo DB',
    // ... other seeder messages
  },
}
```

**When to modify**:

- Customize logging messages
- Add more detailed logging
- Translate to other languages

### Adding Custom Configuration

To add new configuration options:

1. **Add to `config.ts`** with documentation:

```typescript
export const MY_NEW_CONFIG = {
  /** Description of what this setting does */
  MY_SETTING: 'value',
}
```

2. **Import in your file**:

```typescript
import { MY_NEW_CONFIG } from './config'
```

3. **Use it**:

```typescript
const setting = MY_NEW_CONFIG.MY_SETTING
```

### Modifying Data Models

To add fields to picks, submissions, or scores:

1. **Update Mongoose schema** in `models/*.ts`:

```typescript
const PicksSchema: Schema = new Schema({
  projectName: { type: String, required: true },
  newField: { type: String }, // Add here
})
```

2. **Update TypeScript interface** in `types/index.ts`:

```typescript
export interface IPostMessageBody {
  name: string
  message: string
  newField?: string // Add here
}
```

3. **Update validation** in `routes/posts.ts`:

```typescript
check('newField').optional().isString()
```

4. **Update seeder export fields** in `config.ts`:

```typescript
EXPORT_FIELDS: ['projectName', 'newField', ...]
```

---

## 📡 API Endpoints

All endpoints are prefixed with `/posts` (configurable in `config.ts` → `API_ROUTES.POSTS_BASE`)

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
    "message": "<signature>"
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
    "address": "0x1234...", // optional
    "link": "https://project.com", // optional
    "contact": "email@example.com", // optional
    "contactMethod": "email", // optional
    "image": "https://logo.png" // optional
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "_id": "...",
    "name": "Project Name",
    "message": "Project description..."
    // ... other fields
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

**Expected signed statement**: `"This is a signed message"` (configurable in `config.ts` → `WEB3_AUTH_CONFIG.EXPECTED_STATEMENT`)

#### reCAPTCHA Authentication (for POST `/posts`)

Frontend must include a reCAPTCHA v2 token in the `captcha-token` header. The backend verifies it with Google's API.

---

## 💾 Database Seeding

### Overview

The application includes CLI tools for managing picks and scores data. All commands can be run via NPM scripts or directly using Node.js.

### Example Data Files

The repository includes example JSON files to help you get started:

#### `pickData/Picks-Example.json`

Contains **50 sample projects** demonstrating the complete picks data structure:

- `projectName` - Name of the project
- `projectDescription` - Detailed project description (supports multi-line text)
- `website` - Project website URL (e.g., Gitcoin grant page)
- `address` - Ethereum wallet address for receiving funds
- `currentScore` - Initial score (typically 0)
- `contactMethod` - Contact method ("twitter", "discord", "email", etc.)
- `contact` - Contact handle or address
- `icon` - Project logo (base64 encoded image or URL)

#### `scoreData/ScoreSheet-Example.json`

Contains **2 sample user accounts** demonstrating the scores data structure:

- `account` - Ethereum wallet address of the user
- `score` - Point balance allocated to the user (e.g., 50, 100)
- `picks` - Array of point allocations (empty initially: `[]`)
- `message` - Signature field (empty initially: `""`)

**To use these examples**: Copy the example files and rename them (remove `-Example` suffix), then customize with your actual data.

### Managing Picks (Curated Projects)

#### Import Picks from JSON

```bash
npm run seed:picks-import
# or: node dist/pickSeeder.js -i
```

- Reads from `pickData/Picks.json`
- Imports all picks into MongoDB `picks` collection
- Deletes existing picks before importing

**Input file format** (`pickData/Picks.json`):

```json
[
  {
    "projectName": "Project Name",
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

#### Delete All Picks

```bash
npm run seed:picks-delete
# or: node dist/pickSeeder.js -d
```

- Deletes all documents from `picks` collection
- **Warning**: This is irreversible!

#### Export Picks to CSV

```bash
npm run seed:picks-export
# or: node dist/pickSeeder.js -e
```

- Exports all picks from MongoDB to `pickData/exportedPicks.csv`
- Exported fields (configurable in `config.ts`):
  - projectName
  - projectDescription
  - website
  - address
  - contact
  - contactMethod

### Managing Scores (User Point Allocations)

#### Import Scores from JSON

```bash
npm run seed:scores-import
# or: node dist/scoreSeeder.js -i
```

- Reads from `scoreData/ScoreSheet.json`
- Imports user balances into MongoDB `getscores` collection
- Deletes existing scores before importing

**Input file format** (`scoreData/ScoreSheet.json`):

```json
[
  {
    "account": "0x1234...",
    "score": 100,
    "picks": [],
    "message": ""
  }
]
```

#### Delete All Scores

```bash
npm run seed:scores-delete
# or: node dist/scoreSeeder.js -d
```

- Deletes all documents from `getscores` collection
- **Warning**: This is irreversible!

#### Delete All Project Submissions

```bash
npm run seed:posts-delete
# or: node dist/scoreSeeder.js -dp
```

- Deletes all documents from `postmessages` collection
- Useful for clearing test submissions
- **Warning**: This is irreversible!

#### Export Participant Addresses

```bash
npm run seed:scores-export-participants
# or: node dist/scoreSeeder.js -ep
```

- Exports all participant wallet addresses to `scoreData/exportedAccounts.csv`
- Useful for airdrop snapshots
- Exported fields: `address`

#### Export Point Allocation Data

```bash
npm run seed:scores-export-points
# or: node dist/scoreSeeder.js -evp
```

- Exports verified point allocation data to `scoreData/exportedPointData.csv`
- Only includes users with verified signatures (non-empty `message` field)
- Exported fields: `address`, `picks`, `message`
- Useful for final distribution calculations

**Configuration**: All seeder file paths and export fields are configurable in `config.ts` → `SEEDER_CONFIG`. See [Configuration & Customization](#️-configuration--customization) for details.

### Common Workflows

#### Initial Setup

Create your data files based on the example files (see [Example Data Files](#example-data-files) above), then import:

```bash
npm run seed:picks-import
npm run seed:scores-import
```

#### During Testing

```bash
# Clear test submissions
npm run seed:posts-delete

# Reset scores
npm run seed:scores-delete
npm run seed:scores-import
```

#### Final Distribution

```bash
# Export participant list for airdrop
npm run seed:scores-export-participants

# Export verified point allocations
npm run seed:scores-export-points

# Use the CSV files for distribution calculations
```

---

## 📚 Documentation

This project includes **four levels of documentation** to support different needs:

### Level 1: This README

- Overview and getting started
- API endpoints reference
- Configuration guide
- Database seeding instructions

### Level 2: Inline Code Documentation

Every source file includes detailed comments explaining:

- **Purpose** - What the file/function does
- **Workflow** - Step-by-step process explanations
- **Customization** - How to modify for your needs
- **Security** - Authentication and validation notes
- **Examples** - Usage patterns

**Documented files**:

- `config.ts` - All configuration settings
- `index.ts` - Server setup and middleware
- `controllers/posts.ts` - API business logic
- `routes/posts.ts` - Route definitions
- `models/*.ts` - Database schemas
- `types/index.ts` - TypeScript interfaces
- `pickSeeder.ts` - Picks data management
- `scoreSeeder.ts` - Scores data management

### Level 3: TypeScript Type Definitions

- `types/index.ts` contains all data structure interfaces
- Full type safety throughout the codebase
- IntelliSense support in modern IDEs

### Level 4: Auto-Generated JSDoc Documentation

Generate beautiful HTML API documentation:

```bash
# Generate documentation
npm run docs

# Clean and regenerate
npm run docs:clean

# View documentation
# Open docs/index.html in your browser
```

**What's included in JSDoc**:

- Complete API reference for all controllers
- Function parameters and return types
- Usage examples for each function
- Source code links
- Interactive navigation and search

**JSDoc Features**:

- Professional docdash template
- All exported functions documented with `@async`, `@function`, `@param`, `@returns`, `@example` tags
- Auto-generated from TypeScript source code

### Keeping Documentation Updated

When you modify the code:

1. **Update inline comments** in source files
2. **Update JSDoc comments** for changed functions
3. **Rebuild TypeScript**: `npm run build`
4. **Regenerate docs**: `npm run docs`

---

## 🚀 Deployment

### Environment Setup

Ensure all required environment variables are set:

```env
ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
CAPTHCA_SECRET_KEY=your_recaptcha_secret_key
NODE_ENV=production
```

### Production Checklist

Before deploying to production:

- [ ] **Review `config.ts`** and customize all settings
- [ ] **Set CORS origin** to your frontend domain (not `"*"`)
  ```typescript
  ORIGIN: 'https://yourdomain.com'
  ```
- [ ] **Adjust rate limiting** for production traffic
- [ ] **Set `NODE_ENV=production`** in `.env`
- [ ] **Secure MongoDB** with proper authentication
- [ ] **Get production reCAPTCHA keys** from Google
- [ ] **Test all endpoints** with production data
- [ ] **Set up monitoring** and error logging
- [ ] **Configure backup strategy** for MongoDB

### Deployment Platforms

#### Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set ATLAS_URL="your_mongodb_url"
heroku config:set CAPTHCA_SECRET_KEY="your_key"
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Railway

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Railway will auto-deploy on push

#### DigitalOcean App Platform

1. Create new app from GitHub
2. Configure environment variables
3. Set build command: `npm run build`
4. Set run command: `npm start`

#### Docker

```dockerfile
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t voting-app .
docker run -p 5000:5000 --env-file .env voting-app
```

### Performance Optimization

For production:

- Enable MongoDB indexes on frequently queried fields
- Consider Redis for rate limiting in high-traffic scenarios
- Use a reverse proxy (nginx) in front of the Express app
- Enable gzip compression (add middleware)
- Monitor response times and optimize slow queries

---

## 🔧 Troubleshooting

### Common Issues

#### "Cannot connect to MongoDB"

**Cause**: Invalid connection string or network issues

**Solution**:

- Check `ATLAS_URL` in `.env`
- Verify MongoDB Atlas whitelist includes your IP
- Test connection string in MongoDB Compass

#### "reCAPTCHA verification failed"

**Cause**: Invalid or missing reCAPTCHA token

**Solution**:

- Ensure frontend sends token in `captcha-token` header
- Verify `CAPTHCA_SECRET_KEY` in `.env` is correct
- Check that reCAPTCHA keys match (v2, not v3)

#### "Unauthorized User" on `/score` endpoints

**Cause**: Invalid Web3 signature

**Solution**:

- Ensure signed message matches `WEB3_AUTH_CONFIG.EXPECTED_STATEMENT`
- Verify signature is sent in correct format
- Check that wallet address matches account in request

#### "Score mismatch" error

**Cause**: Submitted score doesn't match database

**Solution**:

- Frontend should fetch current score before allowing updates
- Don't allow users to modify their balance
- Only the `picks` array should be updated by users

#### Seeder commands not working

**Cause**: TypeScript not compiled or wrong file paths

**Solution**:

```bash
# Rebuild TypeScript
npm run build

# Verify dist folder exists
ls dist/

# Check file paths in config.ts
```

#### Port already in use

**Solution**:

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
PORT=3000
```

### Debug Mode

Enable more verbose logging:

```typescript
// In index.ts, add:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
```

### Getting Help

1. Check inline code documentation in source files
2. Review `config.ts` for all settings
3. Check generated JSDoc documentation
4. Review this README's relevant sections
5. Check MongoDB logs for database issues
6. Verify environment variables are set correctly

---

## 📋 NPM Scripts Reference

```json
{
  "start": "node dist/index.js", // Run production server
  "dev": "tsx watch index.ts", // Run development server with auto-reload
  "build": "tsc", // Compile TypeScript to JavaScript

  "docs": "jsdoc -c jsdoc.json", // Generate JSDoc documentation
  "docs:clean": "rm -rf docs && npm run docs", // Clean and regenerate docs

  "seed:picks-import": "node dist/pickSeeder.js -i", // Import picks from JSON
  "seed:picks-delete": "node dist/pickSeeder.js -d", // Delete all picks
  "seed:picks-export": "node dist/pickSeeder.js -e", // Export picks to CSV

  "seed:scores-import": "node dist/scoreSeeder.js -i", // Import scores from JSON
  "seed:scores-delete": "node dist/scoreSeeder.js -d", // Delete all scores
  "seed:posts-delete": "node dist/scoreSeeder.js -dp", // Delete all submissions
  "seed:scores-export-participants": "node dist/scoreSeeder.js -ep", // Export addresses
  "seed:scores-export-points": "node dist/scoreSeeder.js -evp" // Export point data
}
```

---

## 🎯 Next Steps

After setting up:

1. **Customize configuration** in `config.ts`
2. **Set up your frontend** to integrate with these API endpoints
3. **Import initial data** using seeder scripts
4. **Test all endpoints** with your frontend
5. **Review security settings** before going live
6. **Deploy to production** using your preferred platform

---

## 🆘 Support & Resources

- **Configuration Reference**: See `config.ts` for all settings
- **API Documentation**: Run `npm run docs` and open `docs/index.html`
- **Inline Documentation**: Every source file has detailed comments
- **Google reCAPTCHA**: https://www.google.com/recaptcha/admin
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **web3-token Library**: https://github.com/bytesbay/web3-token
