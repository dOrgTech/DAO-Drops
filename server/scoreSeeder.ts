/**
 * ====================================
 * SCORES SEEDER
 * ====================================
 *
 * This script manages the Scores collection and PostMessage collection in MongoDB.
 * Use it to import, delete, and export user score and participation data.
 *
 * PURPOSE:
 * - Import user scores from JSON file (e.g., airdrop allocations, voting power)
 * - Delete all scores from the database
 * - Delete all project submissions (posts)
 * - Export participant addresses to CSV
 * - Export verified point allocation data to CSV
 *
 * USAGE:
 * - Import scores:       npm run seed:scores-import  (or: node dist/scoreSeeder.js -i)
 * - Delete scores:       npm run seed:scores-delete  (or: node dist/scoreSeeder.js -d)
 * - Delete posts:        npm run seed:posts-delete   (or: node dist/scoreSeeder.js -dp)
 * - Export participants: npm run seed:scores-export-participants  (or: node dist/scoreSeeder.js -ep)
 * - Export point data:   npm run seed:scores-export-points (or: node dist/scoreSeeder.js -evp)
 *
 * DATA FILE LOCATION:
 * - Input:  scoreData/ScoreSheet.json (configured in config.ts)
 * - Output: exportedAccounts.csv, exportedPointData.csv (configured in config.ts)
 *
 * CUSTOMIZATION GUIDE:
 * 1. Modify data file paths in config.ts (SEEDER_CONFIG.SCORES)
 * 2. Change CSV export fields in config.ts (PARTICIPANTS_EXPORT_FIELDS, POINT_DATA_EXPORT_FIELDS)
 * 3. Modify score filtering logic in export functions (currently filters score == 0)
 * 4. Update ScoreSheet.json structure to match your scoring system
 *
 * FILE FORMAT:
 * ScoreSheet.json should be an array of objects:
 * [
 *   {
 *     "account": "0x1234...",
 *     "score": 100,
 *     "picks": [],
 *     "message": ""
 *   }
 * ]
 */

// ====================================
// DEPENDENCIES
// ====================================

import fs from 'fs'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import GetScore from './models/scores.js'
import PostMessage from './models/postMessage.js'
import json2csv from 'json2csv'
import * as dotenv from 'dotenv'
import { ICleanedScore, ICleanedPointData } from './types/index.js'
import { SERVER_CONFIG, SEEDER_CONFIG, CONSOLE_MESSAGES } from './config.js'

import path from 'path'

// ====================================
// SETUP
// ====================================

const __dirname = path.resolve()

const app = express()
dotenv.config()

app.use(express.json({ limit: SERVER_CONFIG.REQUEST_BODY_LIMIT }))
app.use(express.urlencoded({ limit: SERVER_CONFIG.REQUEST_BODY_LIMIT, extended: true }))
app.use(cors())

// MongoDB connection URL from environment variables
const CONNECTION_URL = process.env.ATLAS_URL as string

const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT

// Connect to MongoDB
mongoose
  .connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(CONSOLE_MESSAGES.SERVER.RUNNING(PORT))))

  .catch((error) => console.log(error.message))

// ====================================
// DATA LOADING
// ====================================

/**
 * Load scores data from JSON file
 * File path is configured in config.ts (SEEDER_CONFIG.SCORES)
 */
const scores: any[] = JSON.parse(
  fs.readFileSync(__dirname + SEEDER_CONFIG.SCORES.DATA_DIRECTORY + '/' + SEEDER_CONFIG.SCORES.INPUT_FILE, 'utf-8'),
)

// ====================================
// SEEDER FUNCTIONS
// ====================================

/**
 * Import user scores from JSON file into MongoDB
 *
 * USAGE: npm run seed:scores-import OR node dist/scoreSeeder.js -i
 *
 * WHAT IT DOES:
 * 1. Reads scores from scoreData/ScoreSheet.json
 * 2. Converts all account addresses to lowercase for consistency
 * 3. Creates a new document in MongoDB for each user
 * 4. Logs each entry as it's added
 * 5. Exits when complete
 *
 * IMPORTANT NOTES:
 * - Account addresses are automatically converted to lowercase
 * - This ensures consistent address comparison throughout the app
 * - Does NOT delete existing scores first
 * - Running multiple times will create duplicates
 * - Use deleteScores() first if you want to start fresh
 *
 * TYPICAL USE CASES:
 * - Setting initial point allocations for users (e.g., airdrop recipients)
 * - Importing voting power from snapshot
 * - Migrating from another system
 *
 * CUSTOMIZATION:
 * - Add data validation before importing
 * - Add duplicate checking by address
 * - Transform score values (e.g., apply multipliers)
 * - Add default values for picks and message fields
 *
 * @async
 * @function importScores
 * @returns {Promise<void>}
 * @example
 * // Command line usage
 * node dist/scoreSeeder.js -i
 */
const importScores = async (): Promise<void> => {
  try {
    for (let i = 0; i < scores.length; i++) {
      // Normalize addresses to lowercase for consistent lookups
      scores[i].account = scores[i].account.toLowerCase()
      await GetScore.create(scores[i])
      console.log(CONSOLE_MESSAGES.SEEDER.ENTRY_ADDED)
      console.log(scores[i])
    }
    console.log(CONSOLE_MESSAGES.SEEDER.SCORES_IMPORTED)
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

/**
 * Delete all user scores from MongoDB
 *
 * USAGE: npm run seed:scores-delete OR node dist/scoreSeeder.js -d
 *
 * WHAT IT DOES:
 * 1. Removes ALL documents from the GetScore collection
 * 2. Logs confirmation message
 * 3. Exits when complete
 *
 * WARNING:
 * - This permanently deletes all user scores and point allocations
 * - All user voting/allocation data will be lost
 * - Consider exporting data before deleting for backup
 * - This operation cannot be undone
 *
 * USE CASES:
 * - Resetting for a new voting/allocation round
 * - Clearing test data
 * - Preparing for a fresh score import
 * - Starting a new phase of your application
 *
 * @async
 * @function deleteScores
 * @returns {Promise<void>}
 * @example
 * // Command line usage
 * node dist/scoreSeeder.js -d
 */
const deleteScores = async (): Promise<void> => {
  try {
    await GetScore.deleteMany()
    console.log(CONSOLE_MESSAGES.SEEDER.SCORES_DELETED)
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

/**
 * Delete all project submissions from MongoDB
 *
 * USAGE: npm run seed:posts-delete OR node dist/scoreSeeder.js -dp
 *
 * WHAT IT DOES:
 * 1. Removes ALL documents from the PostMessage collection
 * 2. Logs confirmation message
 * 3. Exits when complete
 *
 * WARNING:
 * - This permanently deletes all submitted projects
 * - All submission data including contact info will be lost
 * - Consider exporting or reviewing submissions first
 * - This operation cannot be undone
 *
 * USE CASES:
 * - Clearing submissions after review and picks selection
 * - Resetting for a new submission round
 * - Removing test submissions
 * - Preparing database for production
 *
 * @async
 * @function deletePosts
 * @returns {Promise<void>}
 * @example
 * // Command line usage
 * node dist/scoreSeeder.js -dp
 */
const deletePosts = async (): Promise<void> => {
  try {
    await PostMessage.deleteMany()
    console.log(CONSOLE_MESSAGES.SEEDER.POSTS_DELETED)
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

/**
 * Export participant addresses to CSV
 *
 * USAGE: npm run seed:scores-export-participants OR node dist/scoreSeeder.js -ep
 *
 * WHAT IT DOES:
 * 1. Fetches all score records from MongoDB
 * 2. Filters for users with score == 0 (CUSTOMIZATION POINT)
 * 3. Extracts wallet addresses
 * 4. Converts to CSV format
 * 5. Writes to exportedAccounts.csv
 * 6. Exits when complete
 *
 * DEFAULT EXPORTED FIELDS:
 * - address: User's wallet address
 *
 * CURRENT FILTER:
 * - Only exports users with score == 0
 * - This may need modification for your use case
 *
 * CUSTOMIZATION:
 * - Change filter condition: score > 0, score == specificValue, or remove filter
 * - Add more fields in config.ts (PARTICIPANTS_EXPORT_FIELDS)
 * - Include score, picks count, or other metadata
 * - Sort by specific criteria before export
 *
 * USE CASES:
 * - Export participants for token distribution
 * - Generate snapshot of active voters
 * - Create mailing list for communication
 * - Analytics and reporting
 *
 * @async
 * @function exportParticipants
 * @returns {Promise<void>}
 * @example
 * // Command line usage
 * node dist/scoreSeeder.js -ep
 */
const exportParticipants = async (): Promise<void> => {
  try {
    const scoredata = await GetScore.find()
    console.log(CONSOLE_MESSAGES.SEEDER.SCORES_EXPORTED)
    let cleanedScores: ICleanedScore[] = []
    const fields = SEEDER_CONFIG.SCORES.PARTICIPANTS_EXPORT_FIELDS
    const opts = { fields }

    // Filter and extract addresses (currently: score == 0)
    for (let i = 0; i < scoredata.length; i++) {
      console.log(scoredata[i].score)
      if (scoredata[i].score == 0) {
        let address = scoredata[i].account
        let addressOb: ICleanedScore = {
          address,
        }
        cleanedScores.push(addressOb)
      }
    }

    // Convert to CSV and write to file
    try {
      const csv = json2csv.parse(cleanedScores, opts)
      fs.writeFileSync(SEEDER_CONFIG.SCORES.PARTICIPANTS_EXPORT_FILE, csv)

      console.log(csv)
    } catch (err) {
      console.error(err)
    }
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

/**
 * Export verified point allocation data to CSV
 *
 * USAGE: npm run seed:scores-export-points OR node dist/scoreSeeder.js -evp
 *
 * WHAT IT DOES:
 * 1. Fetches all score records from MongoDB
 * 2. Filters for users with score == 0 (CUSTOMIZATION POINT)
 * 3. Extracts address, picks array, and Web3 verification message
 * 4. Converts to CSV format
 * 5. Writes to exportedPointData.csv
 * 6. Exits when complete
 *
 * DEFAULT EXPORTED FIELDS:
 * - address: User's wallet address
 * - picks: Array of point allocations [{ id, points }, ...]
 * - message: Web3 signed token for verification
 *
 * CURRENT FILTER:
 * - Only exports users with score == 0
 * - This filter may need modification for your specific use case
 *
 * DATA VERIFICATION:
 * - The message field contains the Web3 signed token
 * - This can be used to verify the authenticity of point allocations
 * - Useful for auditing and dispute resolution
 *
 * CUSTOMIZATION:
 * - Change filter: export all users, only those who voted, etc.
 * - Add more fields in config.ts (POINT_DATA_EXPORT_FIELDS)
 * - Include timestamps, score values, or other metadata
 * - Transform picks array to more readable format
 *
 * USE CASES:
 * - Audit trail of all point allocations
 * - Verify user votes with Web3 signatures
 * - Backup of allocation data
 * - Analytics on voting patterns
 * - Compliance and reporting
 *
 * @async
 * @function exportVerifiedPoints
 * @returns {Promise<void>}
 * @example
 * // Command line usage
 * node dist/scoreSeeder.js -evp
 */
const exportVerifiedPoints = async (): Promise<void> => {
  try {
    const scoredata = await GetScore.find()
    console.log(CONSOLE_MESSAGES.SEEDER.SCORES_EXPORTED)
    let cleanedPointData: ICleanedPointData[] = []
    const fields = SEEDER_CONFIG.SCORES.POINT_DATA_EXPORT_FIELDS
    const opts = { fields }

    // Filter and extract point allocation data (currently: score == 0)
    for (let i = 0; i < scoredata.length; i++) {
      console.log(scoredata[i].score)
      console.log(scoredata[i].picks)
      console.log(scoredata[i].message)
      if (scoredata[i].score == 0) {
        let address = scoredata[i].account
        let picks = scoredata[i].picks
        let message = scoredata[i].message
        let addressOb: ICleanedPointData = {
          address,
          picks,
          message,
        }
        cleanedPointData.push(addressOb)
      }
    }

    // Convert to CSV and write to file
    try {
      const csv = json2csv.parse(cleanedPointData, opts)
      fs.writeFileSync(SEEDER_CONFIG.SCORES.POINT_DATA_EXPORT_FILE, csv)

      console.log(csv)
    } catch (err) {
      console.error(err)
    }
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

// ====================================
// COMMAND LINE INTERFACE
// ====================================

/**
 * Execute function based on command line argument
 *
 * COMMANDS:
 * -i   : Import scores from JSON to MongoDB
 * -d   : Delete all scores from MongoDB
 * -dp  : Delete all posts (project submissions) from MongoDB
 * -ep  : Export participant addresses to CSV
 * -evp : Export verified point allocation data to CSV
 *
 * USAGE EXAMPLES:
 * node dist/scoreSeeder.js -i
 * npm run seed:scores-import
 *
 * ADDING NEW COMMANDS:
 * 1. Create a new async function above
 * 2. Add an else if block below with a new flag
 * 3. Optionally add npm script to package.json for convenience
 */
if (process.argv[2] === '-i') {
  importScores()
} else if (process.argv[2] === '-d') {
  deleteScores()
} else if (process.argv[2] === '-dp') {
  deletePosts()
} else if (process.argv[2] === '-ep') {
  exportParticipants()
} else if (process.argv[2] === '-evp') {
  exportVerifiedPoints()
}
