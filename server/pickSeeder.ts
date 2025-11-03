/**
 * ====================================
 * PICKS SEEDER
 * ====================================
 *
 * This script manages the Picks collection in your MongoDB database.
 * Use it to import, delete, and export curated project data.
 *
 * PURPOSE:
 * - Import approved projects from JSON file into the database
 * - Delete all picks from the database (use carefully!)
 * - Export picks to CSV for analysis or backup
 *
 * USAGE:
 * - Import picks:  npm run seed:picks-import  (or: node dist/pickSeeder.js -i)
 * - Delete picks:  npm run seed:picks-delete  (or: node dist/pickSeeder.js -d)
 * - Export picks:  npm run seed:picks-export  (or: node dist/pickSeeder.js -e)
 *
 * DATA FILE LOCATION:
 * - Input:  pickData/Picks.json (configured in config.ts)
 * - Output: exportedPicks.csv (configured in config.ts)
 *
 * CUSTOMIZATION GUIDE:
 * 1. Modify data file paths in config.ts (SEEDER_CONFIG.PICKS)
 * 2. Change CSV export fields in config.ts (EXPORT_FIELDS)
 * 3. Add custom operations by creating new functions and command flags
 * 4. Update the Picks.json file structure to match your schema
 *
 * FILE FORMAT:
 * Picks.json should be an array of objects with these fields:
 * [
 *   {
 *     "projectName": "Project Name",
 *     "projectDescription": "Description...",
 *     "website": "https://...",
 *     "address": "0x...",
 *     "icon": "https://...",
 *     "contact": "email@example.com",
 *     "contactMethod": "email",
 *     "currentScore": 0,
 *     "currentPoints": [],
 *     "usdcAmount": 1000
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
import Picks from './models/picks.js'
import path from 'path'
import json2csv from 'json2csv'
import * as dotenv from 'dotenv'
import { ICleanedPick } from './types/index.js'
import { SERVER_CONFIG, SEEDER_CONFIG, CONSOLE_MESSAGES } from './config.js'

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
 * Load picks data from JSON file
 * File path is configured in config.ts (SEEDER_CONFIG.PICKS)
 */
const picks: any[] = JSON.parse(
  fs.readFileSync(__dirname + SEEDER_CONFIG.PICKS.DATA_DIRECTORY + '/' + SEEDER_CONFIG.PICKS.INPUT_FILE, 'utf-8'),
)

// ====================================
// SEEDER FUNCTIONS
// ====================================

/**
 * Import picks from JSON file into MongoDB
 *
 * USAGE: npm run seed:picks-import OR node dist/pickSeeder.js -i
 *
 * WHAT IT DOES:
 * 1. Reads picks from pickData/Picks.json
 * 2. Creates a new document in MongoDB for each pick
 * 3. Logs each entry as it's added
 * 4. Exits when complete
 *
 * IMPORTANT:
 * - This does NOT delete existing picks first
 * - Running multiple times will create duplicates
 * - Use deletePicks() first if you want to start fresh
 *
 * CUSTOMIZATION:
 * - Modify data file path in config.ts
 * - Add data transformation/validation before creating picks
 * - Add duplicate checking: const existing = await Picks.findOne({ address })
 *
 * @async
 * @function importPicks
 * @returns {Promise<void>}
 * @example
 * // Command line usage
 * node dist/pickSeeder.js -i
 */
const importPicks = async (): Promise<void> => {
  try {
    for (let i = 0; i < picks.length; i++) {
      await Picks.create(picks[i])
      console.log(CONSOLE_MESSAGES.SEEDER.ENTRY_ADDED)
      console.log(picks[i])
    }
    console.log(CONSOLE_MESSAGES.SEEDER.PICKS_IMPORTED)
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

/**
 * Delete all picks from MongoDB
 *
 * USAGE: npm run seed:picks-delete OR node dist/pickSeeder.js -d
 *
 * WHAT IT DOES:
 * 1. Removes ALL documents from the Picks collection
 * 2. Logs confirmation message
 * 3. Exits when complete
 *
 * WARNING:
 * - This permanently deletes all picks
 * - User point allocations referencing these picks may become invalid
 * - Consider exporting picks before deleting for backup
 * - This operation cannot be undone
 *
 * USE CASES:
 * - Resetting the database for a new voting round
 * - Clearing test data
 * - Preparing for a fresh import
 *
 * @async
 * @function deletePicks
 * @returns {Promise<void>}
 * @example
 * // Command line usage
 * node dist/pickSeeder.js -d
 */
const deletePicks = async (): Promise<void> => {
  try {
    await Picks.deleteMany()
    console.log(CONSOLE_MESSAGES.SEEDER.PICKS_DELETED)
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

/**
 * Export picks from MongoDB to CSV file
 *
 * USAGE: npm run seed:picks-export OR node dist/pickSeeder.js -e
 *
 * WHAT IT DOES:
 * 1. Fetches all picks from MongoDB
 * 2. Extracts specified fields (configured in config.ts)
 * 3. Converts to CSV format
 * 4. Writes to exportedPicks.csv
 * 5. Logs the CSV content
 * 6. Exits when complete
 *
 * DEFAULT EXPORTED FIELDS:
 * - projectName
 * - projectDescription
 * - website
 * - address
 * - contact
 * - contactMethod
 *
 * CUSTOMIZATION:
 * - Add/remove fields in config.ts (SEEDER_CONFIG.PICKS.EXPORT_FIELDS)
 * - Change output file name in config.ts (EXPORT_FILE)
 * - Add data transformation before export
 * - Include currentScore, usdcAmount for analytics
 *
 * USE CASES:
 * - Backup picks data
 * - Share project list with stakeholders
 * - Data analysis in spreadsheet tools
 * - Migration to other systems
 *
 * @async
 * @function exportPicks
 * @returns {Promise<void>}
 * @example
 * // Command line usage
 * node dist/pickSeeder.js -e
 */
const exportPicks = async (): Promise<void> => {
  try {
    const picksdata = await Picks.find()
    console.log(CONSOLE_MESSAGES.SEEDER.PICKS_EXPORTED)
    let cleanedPicks: ICleanedPick[] = []
    const fields = SEEDER_CONFIG.PICKS.EXPORT_FIELDS
    const opts = { fields }

    // Extract specified fields from each pick
    for (let i = 0; i < picksdata.length; i++) {
      let projectName = picksdata[i].projectName
      let projectDescription = picksdata[i].projectDescription
      let website = picksdata[i].website
      let address = picksdata[i].address
      let contact = picksdata[i].contact
      let contactMethod = picksdata[i].contactMethod

      let indiPick: ICleanedPick = {
        projectName,
        projectDescription,
        website,
        address,
        contact,
        contactMethod,
      }
      cleanedPicks.push(indiPick)
    }

    // Convert to CSV and write to file
    try {
      const csv = json2csv.parse(cleanedPicks, opts)
      fs.writeFileSync(SEEDER_CONFIG.PICKS.EXPORT_FILE, csv)

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
 * -i : Import picks from JSON to MongoDB
 * -d : Delete all picks from MongoDB
 * -e : Export picks from MongoDB to CSV
 *
 * USAGE EXAMPLES:
 * node dist/pickSeeder.js -i
 * npm run seed:picks-import
 *
 * ADDING NEW COMMANDS:
 * 1. Create a new async function above
 * 2. Add an else if block below with a new flag
 * 3. Optionally add npm script to package.json
 */
if (process.argv[2] === '-i') {
  importPicks()
} else if (process.argv[2] === '-d') {
  deletePicks()
} else if (process.argv[2] === '-e') {
  exportPicks()
}
