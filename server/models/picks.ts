/**
 * ====================================
 * PICKS MODEL
 * ====================================
 *
 * This model represents curated projects that users can allocate points to.
 * Picks are the "approved" projects that appear in the voting/allocation phase.
 *
 * DATA FLOW:
 * 1. Projects are submitted via the PostMessage model
 * 2. Administrators review submissions
 * 3. Selected projects are added to the Picks collection via pickSeeder.ts
 * 4. Users allocate points to these picks via the updateScore endpoint
 *
 * DATA MANAGEMENT:
 * - Import picks: npm run seed:picks-import
 * - Delete picks: npm run seed:picks-delete
 * - Export picks: npm run seed:picks-export
 * - See pickSeeder.ts for more operations
 *
 * CUSTOMIZATION:
 * - Add additional fields to the schema as needed
 * - Modify collection name in database by adding: mongoose.model('Picks', picksSchema, 'your_collection_name')
 * - Update types/index.ts (IPicks) when adding/removing fields
 */

// ====================================
// DEPENDENCIES
// ====================================

import mongoose from 'mongoose'
import { IPicks } from '../types/index.js'

// ====================================
// SCHEMA DEFINITION
// ====================================

/**
 * Picks Schema
 *
 * FIELDS:
 * - projectName: Name of the project/organization
 * - projectDescription: Detailed description of what the project does
 * - website: Project's official website URL
 * - address: Blockchain address (wallet or contract address)
 * - icon: URL or path to project's icon/logo
 * - contact: Contact information (email, Discord, etc.)
 * - contactMethod: Preferred method of contact
 * - currentScore: Total points this project has received from all users
 * - currentPoints: Array tracking individual point allocations
 * - usdcAmount: USDC reward amount (if applicable)
 *
 * CUSTOMIZATION:
 * - Add validation rules: e.g., required: true, min/max values
 * - Add default values: e.g., currentScore: { type: Number, default: 0 }
 * - Add indexes for better query performance: e.g., { address: 1 }
 * - Add timestamps: Add { timestamps: true } as second parameter to Schema
 */
const picksSchema = new mongoose.Schema({
  projectName: String,
  projectDescription: String,
  website: String,
  address: String,
  icon: String,
  contact: String,
  contactMethod: String,
  currentScore: Number, // Cumulative score from all user allocations
  currentPoints: Array, // Array of point allocation records
  usdcAmount: Number, // Optional reward amount in USDC
})

// ====================================
// MODEL EXPORT
// ====================================

/**
 * Picks Model
 *
 * COLLECTION NAME: 'picks' (automatically pluralized and lowercased by Mongoose)
 *
 * USAGE EXAMPLES:
 * - Find all picks: await Picks.find()
 * - Find by ID: await Picks.findById(id)
 * - Find by address: await Picks.findOne({ address: '0x...' })
 * - Update score: await Picks.findByIdAndUpdate(id, { currentScore: newScore })
 */
const Picks = mongoose.model<IPicks>('Picks', picksSchema)

export default Picks
