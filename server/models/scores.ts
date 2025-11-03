/**
 * ====================================
 * SCORES MODEL
 * ====================================
 *
 * This model represents user accounts and their point allocation data.
 * Each document represents one user/wallet and tracks their points and choices.
 *
 * PURPOSE:
 * - Store total points available for each user
 * - Track which projects each user has allocated points to
 * - Verify point allocations via Web3 signed messages
 * - Prevent users from allocating more points than they have
 *
 * WORKFLOW:
 * 1. Initial scores are seeded via scoreSeeder.ts from ScoreSheet.json
 * 2. Users retrieve their score via GET /posts/score/:id
 * 3. Users allocate points via PATCH /posts/score/:id
 * 4. The system validates and stores their choices
 *
 * DATA MANAGEMENT:
 * - Import scores: npm run seed:scores-import
 * - Delete scores: npm run seed:scores-delete
 * - Export participants: npm run seed:scores-export-participants
 * - Export point data: npm run seed:scores-export-points
 * - See scoreSeeder.ts for more operations
 *
 * CUSTOMIZATION:
 * - Add fields like: tier, bonusPoints, participationDate
 * - Modify scoring logic in controllers/posts.ts (updateScore)
 * - Update types/index.ts (IScore, IPickItem) when changing structure
 */

// ====================================
// DEPENDENCIES
// ====================================

import mongoose from 'mongoose'
import { IScore } from '../types/index.js'

// ====================================
// SCHEMA DEFINITION
// ====================================

/**
 * Score Schema
 *
 * FIELDS:
 * - account: User's blockchain wallet address (lowercase for consistency)
 * - score: Total points available to this user
 * - picks: Array of { id, points } objects showing point allocations
 *          Each pick contains:
 *          - id: MongoDB ObjectId of the project from Picks collection
 *          - points: Number of points allocated to that project
 * - message: Web3 signed token containing the picks data for verification
 *
 * VALIDATION LOGIC:
 * - Sum of all picks[].points must equal the user's score
 * - This prevents users from allocating more points than they have
 * - The message field contains a signed version of picks for tamper-proofing
 *
 * CUSTOMIZATION:
 * - Add indexes: { account: 1 } for faster lookups
 * - Add fields like lastUpdated, votingPhase, bonusMultiplier
 * - Consider adding a separate model for historical picks tracking
 * - Add validation at schema level: required: true, min: 0
 */
const scoreSchema = new mongoose.Schema({
  account: String, // Wallet address (stored in lowercase)
  score: Number, // Total points available to allocate
  picks: Array, // Array of objects: [{ id: projectId, points: allocatedPoints }, ...]
  message: String, // Web3 signed token for verification
})

// ====================================
// MODEL EXPORT
// ====================================

/**
 * GetScore Model
 *
 * COLLECTION NAME: 'getscores' (automatically pluralized and lowercased by Mongoose)
 *
 * USAGE EXAMPLES:
 * - Find user's score: await GetScore.findOne({ account: address.toLowerCase() })
 * - Update picks: await GetScore.findByIdAndUpdate(id, { picks, message })
 * - Find users with unused points: await GetScore.find({ picks: { $size: 0 } })
 * - Count total participants: await GetScore.countDocuments()
 */
const GetScore = mongoose.model<IScore>('GetScore', scoreSchema)

export default GetScore
