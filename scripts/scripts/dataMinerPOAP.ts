/**
 * ====================================================================
 * DAO DROPS - POAP EVENT ATTENDANCE SCORER
 * ====================================================================
 *
 * This script generates account scores based ONLY on POAP (Proof of Attendance
 * Protocol) event attendance data.
 *
 * WHAT IT DOES:
 * - Reads CSV files containing POAP event attendance records
 * - Awards points for each event attended by an Ethereum address
 * - Aggregates scores across all events for each unique address
 * - Outputs a JSON file with account scores and statistical analysis
 *
 * OUTPUT FILE: ScoreSheetPOAP.json (configurable in config.ts)
 *
 * USE CASE:
 * - Score accounts based purely on Ethereum event participation
 * - Identify active community members who attend conferences/hackathons
 * - Useful for airdrops targeting engaged ecosystem participants
 *
 * CUSTOMIZATION:
 * - Adjust POAP_SCORE_PER_EVENT in config.ts to change point values
 * - Add/remove event CSV files in POAP_EVENT_FILES array in config.ts
 * - Modify SCORE_THRESHOLDS in config.ts to track different score ranges
 *
 * HOW TO RUN:
 * npm run poap
 * or: npx ts-node scripts/dataMinerPOAP.ts
 */

import * as fs from "fs";
import { parse } from "csv-parse/sync";
import { AccountObject, POAPRecord } from "./types";
import {
  CSV_SOURCE_DIRECTORY,
  OUTPUT_FILES,
  OUTPUT_DIRECTORY,
  POAP_EVENT_FILES,
  POAP_SCORE_PER_EVENT,
  SCORE_THRESHOLDS,
  CSV_PARSE_OPTIONS,
  CSV_COLUMNS,
} from "./config";

// ====================================================================
// STATE VARIABLES
// ====================================================================

/**
 * Main data structures for tracking accounts and scores
 */
let accounts: AccountObject[] = []; // Final array of all unique accounts with their scores
let overAllScore: number = 0; // Sum of all scores across all accounts
let scores: number[] = []; // Array of individual scores for statistical analysis
let poapNumberOfAccounts: number = 0; // Count of unique accounts found in POAP data
let poapScoresArray: number[] = []; // Array of POAP scores for median calculation
let totalScorePOAP: number = 0; // Total cumulative score from POAP events
let highestPOAPscore: number = 0; // Highest individual account score

/**
 * Counters for score distribution analysis
 * These track how many accounts exceed each threshold defined in SCORE_THRESHOLDS
 * Used to generate distribution reports at the end of execution
 */
let numberOfAccountsAbove10: number = 0;
let numberOfAccountsAbove20: number = 0;
let numberOfAccountsAbove30: number = 0;
let numberOfAccountsAbove50: number = 0;
let numberOfAccountsAbove75: number = 0;
let numberOfAccountsAbove100: number = 0;
let numberOfAccountsAbove125: number = 0;
let numberOfAccountsAbove150: number = 0;
let numberOfAccountsAbove175: number = 0;
let numberOfAccountsAbove200: number = 0;

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

/**
 * Calculate the median value of an array of numbers
 *
 * @param arr - Array of numbers to calculate median for
 * @returns The median value (middle value for odd length, average of two middle values for even length)
 *
 * ALGORITHM:
 * 1. Sort the array in ascending order
 * 2. If odd length: return the middle element
 * 3. If even length: return the average of the two middle elements
 */
const median = (arr: number[]): number => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

// ====================================================================
// CSV PARSING FUNCTIONS
// ====================================================================

/**
 * Parse a POAP event CSV file and add scores to accounts
 *
 * This function processes a single POAP event CSV file. It can be called
 * multiple times for different event files, and will aggregate scores for
 * accounts that appear in multiple events.
 *
 * @param fileLocation - Name of the CSV file to parse (relative to CSV_SOURCE_DIRECTORY)
 *
 * SCORING LOGIC:
 * 1. Read and parse the CSV file
 * 2. For each attendee in the file:
 *    - If account is new: create new entry with POAP_SCORE_PER_EVENT points
 *    - If account exists: add POAP_SCORE_PER_EVENT to their existing score
 * 3. Track statistics for reporting (highest score, totals, etc.)
 * 4. Update threshold counters for distribution analysis
 *
 * CUSTOMIZATION POINTS:
 * - POAP_SCORE_PER_EVENT: change how many points each event is worth (config.ts)
 * - CSV_COLUMNS.POAP.COLLECTION: if your CSV uses different column names (config.ts)
 * - CSV_PARSE_OPTIONS.POAP: adjust CSV parsing settings (config.ts)
 */
const generalizedPOAPparse = async (fileLocation: string): Promise<void> => {
  console.log("Parsing " + fileLocation);

  // Read the CSV file from disk
  const file = await fs.readFileSync(__dirname + CSV_SOURCE_DIRECTORY + fileLocation);

  // Parse CSV into array of objects using settings from config
  const records = parse(file, CSV_PARSE_OPTIONS.POAP) as any[];

  let recordLength = records.length;

  // Process each attendee record in the event CSV
  for (let i = 0; i < recordLength; i++) {
    // Extract the Ethereum address from the CSV column
    let poapAccount = records[i][CSV_COLUMNS.POAP.COLLECTION];

    // Clean up the address by removing any quote characters
    poapAccount = poapAccount.replace(/"/g, "");

    // Check if we've already seen this account in previous events
    let existingAccount = accounts.find((accountObject) => accountObject.account === poapAccount);

    let currentAccountScore: number = 0;

    if (existingAccount === undefined) {
      // NEW ACCOUNT: First time seeing this address
      poapNumberOfAccounts++;
      let accountObject: AccountObject = {
        account: poapAccount,
        score: POAP_SCORE_PER_EVENT, // Award points for this event
      };
      accounts.push(accountObject);
      overAllScore += POAP_SCORE_PER_EVENT;
      currentAccountScore = POAP_SCORE_PER_EVENT;
    } else {
      // EXISTING ACCOUNT: Add points to their running total
      existingAccount.score += POAP_SCORE_PER_EVENT;
      overAllScore += POAP_SCORE_PER_EVENT;
      currentAccountScore = existingAccount.score;
    }

    // Track scores for statistical analysis
    scores.push(currentAccountScore);
    poapScoresArray.push(currentAccountScore);

    // Update cumulative statistics
    totalScorePOAP += parseInt(currentAccountScore.toString());
    if (highestPOAPscore < parseInt(currentAccountScore.toString())) {
      highestPOAPscore = parseInt(currentAccountScore.toString());
    }
  }

  // Calculate statistical metrics (currently unused but available for analysis)
  let averageScorePOAP = totalScorePOAP / poapNumberOfAccounts;
  let medianScorePOAP = median(poapScoresArray);

  /**
   * Count how many accounts exceed each score threshold
   * This builds distribution data for the final report
   * The thresholds are configurable in SCORE_THRESHOLDS (config.ts)
   */
  let accountsLength = accounts.length;
  for (let i = 0; i < accountsLength; i++) {
    if (accounts[i].score >= SCORE_THRESHOLDS[0]) {
      numberOfAccountsAbove10++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[1]) {
      numberOfAccountsAbove20++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[2]) {
      numberOfAccountsAbove30++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[3]) {
      numberOfAccountsAbove50++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[4]) {
      numberOfAccountsAbove75++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[5]) {
      numberOfAccountsAbove100++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[6]) {
      numberOfAccountsAbove125++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[7]) {
      numberOfAccountsAbove150++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[8]) {
      numberOfAccountsAbove175++;
    }
    if (accounts[i].score >= SCORE_THRESHOLDS[9]) {
      numberOfAccountsAbove200++;
    }
  }
};

// ====================================================================
// MAIN EXECUTION FUNCTION
// ====================================================================

/**
 * Main function - orchestrates the POAP scoring process
 *
 * EXECUTION FLOW:
 * 1. Process all POAP event CSV files defined in config
 * 2. Aggregate scores across all events
 * 3. Write results to JSON file
 * 4. Output comprehensive statistics to console
 *
 * OUTPUT:
 * - JSON file with array of {account, score} objects
 * - Console logs with statistical analysis and score distribution
 *
 * CUSTOMIZATION:
 * - Add/remove event files in POAP_EVENT_FILES (config.ts)
 * - Change output file name in OUTPUT_FILES.POAP_SCORE (config.ts)
 * - Modify output directory in OUTPUT_DIRECTORY (config.ts)
 */
async function main(): Promise<void> {
  console.log("dataminer POAP only starting");

  /**
   * Process all POAP event files from config
   * Each file adds scores to the accounts array
   * Accounts appearing in multiple events accumulate points
   */
  for (const eventFile of POAP_EVENT_FILES) {
    await generalizedPOAPparse(eventFile);
  }

  // ====================================================================
  // OUTPUT GENERATION
  // ====================================================================

  /**
   * Convert the accounts array to JSON and save to file
   * The output file will contain an array of {account, score} objects
   * that can be used for airdrops or further analysis
   */
  console.log("JSONifying data");
  var jsonData = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(OUTPUT_DIRECTORY + OUTPUT_FILES.POAP_SCORE, jsonData);
  console.log("Data JSONified into " + OUTPUT_FILES.POAP_SCORE + "!!!");
  // ====================================================================
  // STATISTICAL REPORTING
  // ====================================================================

  /**
   * Output comprehensive statistics about the scoring results
   * This helps understand the distribution and characteristics of the data
   */
  console.log("The total number of accounts in the POAP data is: ");
  console.log(poapNumberOfAccounts);
  console.log("The total score from the POAP data is: ");
  console.log(totalScorePOAP);
  console.log("The highest score in the POAP data is: ");
  console.log(highestPOAPscore);
  console.log("The average score for the POAP data is: ");
  console.log(overAllScore / accounts.length);
  console.log("The median score for the POAP data is: ");
  console.log(median(scores));

  /**
   * Calculate score distribution by ranges
   * This shows how accounts are distributed across different score buckets
   *
   * Example: If 100 accounts are above 175 and 20 are above 200,
   * then n175 = 80 accounts are in the 175-200 range
   */
  let n175 = numberOfAccountsAbove175 - numberOfAccountsAbove200;
  let n150 = numberOfAccountsAbove150 - n175; // Accounts in 150-175 range
  let n125 = numberOfAccountsAbove125 - n150; // Accounts in 125-150 range
  let n100 = numberOfAccountsAbove100 - n125; // Accounts in 100-125 range
  let n75 = numberOfAccountsAbove75 - n100; // Accounts in 75-100 range
  let n50 = numberOfAccountsAbove50 - n75; // Accounts in 50-75 range
  let n30 = numberOfAccountsAbove30 - n50; // Accounts in 30-50 range
  let n20 = numberOfAccountsAbove20 - n30; // Accounts in 20-30 range
  let n10 = numberOfAccountsAbove10 - n20; // Accounts in 10-20 range
  let totalAbove10 = n10 + n20 + n30 + n50 + n75 + n100 + n125 + n150 + n175 + numberOfAccountsAbove200;

  /**
   * Output detailed distribution report
   * Shows exactly how many accounts fall into each score range
   * Useful for understanding the scoring curve and setting thresholds
   */
  console.log("The number of accounts with a score above 10 but less than 20: ");
  console.log(n10);
  console.log("The number of accounts with a score above 20 but less than 30: ");
  console.log(n20);
  console.log("The number of accounts with a score above 30 but less than 50: ");
  console.log(n30);
  console.log("The number of accounts with a score above 50 but less than 75: ");
  console.log(n50);
  console.log("The number of accounts with a score above 75 but less than 100: ");
  console.log(n75);
  console.log("The number of accounts with a score above 100 but less than 125: ");
  console.log(n100);
  console.log("The number of accounts with a score above 125 but less than 150: ");
  console.log(n125);
  console.log("The number of accounts with a score above 150 but less than 175: ");
  console.log(n150);
  console.log("The number of accounts with a score above 175 but less than 200: ");
  console.log(n175);
  console.log("The number of accounts with a score above 200: ");
  console.log(numberOfAccountsAbove200);
  console.log("The number of accounts with a score above 10: ");
  console.log(totalAbove10);
}

// ====================================================================
// SCRIPT EXECUTION
// ====================================================================

/**
 * Execute the main function and handle the process lifecycle
 *
 * - Exits with code 0 on success
 * - Exits with code 1 on error (logs error details)
 *
 * This pattern ensures the script properly terminates after completion
 */
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
