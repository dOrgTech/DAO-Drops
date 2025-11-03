/**
 * ====================================
 * TYPE DEFINITIONS
 * ====================================
 *
 * This file contains all TypeScript type definitions and interfaces
 * used throughout the application.
 *
 * PURPOSE:
 * - Provide type safety for TypeScript
 * - Document data structures
 * - Enable better IDE autocomplete
 * - Catch errors at compile time
 *
 * ORGANIZATION:
 * 1. Database Model Types (PostMessage, Picks, Score)
 * 2. Request Body Types (for API endpoints)
 * 3. Web3 Authentication Types
 * 4. Export/Seeder Data Types
 *
 * CUSTOMIZATION:
 * - Add new fields to interfaces when extending models
 * - Create new interfaces for new features
 * - Keep interfaces in sync with Mongoose schemas
 * - Document field purposes with comments
 */

// ====================================
// EXTERNAL DEPENDENCIES
// ====================================

import { Request } from 'express'
import { Document } from 'mongoose'

// ====================================
// DATABASE MODEL TYPES
// ====================================

/**
 * PostMessage Interface
 *
 * Represents a project submission in the database.
 * Extends Mongoose Document for MongoDB operations.
 *
 * USAGE: Used by models/postMessage.ts
 *
 * FIELDS:
 * - name: Project name (required via validation)
 * - message: Project description/pitch (required via validation)
 * - address: Blockchain address (optional)
 * - link: Project website or relevant link (optional)
 * - contact: Contact information (optional)
 * - contactMethod: Preferred contact method (optional)
 * - image: Project image/logo URL (optional)
 * - createdAt: Auto-generated submission timestamp
 *
 * CUSTOMIZATION:
 * Add fields like: category, fundingGoal, teamSize, socialLinks, etc.
 */
export interface IPostMessage extends Document {
  name: string
  message: string
  address: string
  link: string
  contact: string
  contactMethod: string
  image: string
  createdAt: Date
}

/**
 * Picks Interface
 *
 * Represents a curated project that users can allocate points to.
 * Extends Mongoose Document for MongoDB operations.
 *
 * USAGE: Used by models/picks.ts
 *
 * FIELDS:
 * - projectName: Display name of the project
 * - projectDescription: What the project does
 * - website: Official project website
 * - address: Blockchain address (wallet or contract)
 * - icon: Logo/icon URL
 * - contact: Contact information
 * - contactMethod: How to contact (email, Discord, etc.)
 * - currentScore: Total points allocated by all users
 * - currentPoints: Array of point allocation records
 * - usdcAmount: Optional reward/funding amount in USDC
 *
 * CUSTOMIZATION:
 * Add fields like: category, tags, verified, ranking, socialMedia, etc.
 */
export interface IPicks extends Document {
  projectName: string
  projectDescription: string
  website: string
  address: string
  icon: string
  contact: string
  contactMethod: string
  currentScore: number
  currentPoints: any[]
  usdcAmount: number
}

/**
 * Score Interface
 *
 * Represents a user's account and their point allocation data.
 * Extends Mongoose Document for MongoDB operations.
 *
 * USAGE: Used by models/scores.ts
 *
 * FIELDS:
 * - account: User's wallet address (stored lowercase)
 * - score: Total points available to this user
 * - picks: Array of { id, points } showing allocations
 * - message: Web3 signed token for verification
 *
 * BUSINESS LOGIC:
 * - Sum of all picks[].points must equal score
 * - Message contains signed version of picks for tamper-proofing
 *
 * CUSTOMIZATION:
 * Add fields like: tier, bonusPoints, lastUpdated, votingPhase, etc.
 */
export interface IScore extends Document {
  account: string
  score: number
  picks: IPickItem[]
  message: string
}

/**
 * PickItem Interface
 *
 * Represents a single point allocation to a project.
 *
 * FIELDS:
 * - id: MongoDB ObjectId of the pick/project
 * - points: Number of points allocated to this project
 *
 * USAGE:
 * - Array of these forms the picks field in IScore
 * - Used in score update validation
 */
export interface IPickItem {
  id: string
  points: number
}

// ====================================
// REQUEST BODY TYPES
// ====================================

/**
 * PostMessage Request Body
 *
 * Type definition for POST /posts endpoint body.
 * Represents data submitted when creating a new project submission.
 *
 * REQUIRED FIELDS: name, message (enforced by express-validator)
 * OPTIONAL FIELDS: address, link, contact, contactMethod, image
 *
 * VALIDATION:
 * See routes/posts.ts for validation rules
 */
export interface IPostMessageBody {
  name: string
  message: string
  address?: string
  link?: string
  contact?: string
  contactMethod?: string
  image?: string
}

/**
 * Score Update Request Body
 *
 * Type definition for PATCH /posts/score/:id endpoint body.
 * Represents data submitted when user allocates their points.
 *
 * ALL FIELDS REQUIRED (enforced by express-validator)
 *
 * VALIDATION:
 * - Sum of picks[].points must equal score
 * - Message must be Web3 signed token containing picks
 * - See routes/posts.ts for validation rules
 */
export interface IScoreUpdateBody {
  account: string
  score: number
  picks: IPickItem[]
  message: string
}

// ====================================
// WEB3 AUTHENTICATION TYPES
// ====================================

/**
 * Web3 Token Verification Result
 *
 * Type definition for the result of Web3Token.verify().
 * Used to extract wallet address and signed data from Web3 tokens.
 *
 * FIELDS:
 * - address: Ethereum wallet address that signed the token
 * - body.statement: The message/data that was signed
 *
 * USAGE:
 * - Used in getScore and updateScore controllers
 * - Ensures requests come from the actual wallet owner
 *
 * SECURITY:
 * - Statement must match expected value (config.ts)
 * - For updateScore, statement must equal JSON.stringify(picks)
 */
export interface IWeb3TokenVerification {
  address: string
  body: {
    statement: string
  }
}

/**
 * Authenticated Request Interface
 *
 * Extended Express Request with authentication headers.
 *
 * HEADERS:
 * - auth: Web3 signed token for wallet authentication
 * - captcha-token: Google reCAPTCHA token for spam protection
 *
 * USAGE:
 * Can be used to type-check requests requiring these headers
 * Currently not used, but available for future enhancements
 */
export interface IAuthRequest extends Request {
  headers: {
    auth?: string
    'captcha-token'?: string
  }
}

// ====================================
// EXPORT/SEEDER DATA TYPES
// ====================================

/**
 * Cleaned Pick Data
 *
 * Simplified pick data for CSV export.
 * Contains only essential fields without MongoDB metadata.
 *
 * USAGE: Used in pickSeeder.ts exportPicks() function
 *
 * FIELDS:
 * Based on SEEDER_CONFIG.PICKS.EXPORT_FIELDS in config.ts
 *
 * CUSTOMIZATION:
 * Add/remove fields based on export requirements
 */
export interface ICleanedPick {
  projectName: string
  projectDescription: string
  website: string
  address: string
  contact: string
  contactMethod: string
}

/**
 * Cleaned Score Data
 *
 * Simplified score data for participant CSV export.
 * Contains only wallet addresses.
 *
 * USAGE: Used in scoreSeeder.ts exportParticipants() function
 *
 * CUSTOMIZATION:
 * Add score, pickCount, or other fields as needed
 */
export interface ICleanedScore {
  address: string
}

/**
 * Cleaned Point Data
 *
 * Detailed point allocation data for CSV export.
 * Includes address, picks, and verification message.
 *
 * USAGE: Used in scoreSeeder.ts exportVerifiedPoints() function
 *
 * FIELDS:
 * - address: User's wallet address
 * - picks: Array of point allocations
 * - message: Web3 signed token for verification
 *
 * USE CASES:
 * - Audit trail
 * - Compliance verification
 * - Analytics on voting patterns
 */
export interface ICleanedPointData {
  address: string
  picks: IPickItem[]
  message: string
}
