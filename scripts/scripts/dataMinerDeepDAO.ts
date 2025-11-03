/**
 * ====================================================================
 * DAO DROPS - DEEPDAO DAO PARTICIPATION SCORER
 * ====================================================================
 *
 * This script generates account scores based ONLY on DeepDAO data,
 * which tracks participation in decentralized autonomous organizations (DAOs).
 *
 * WHAT IT DOES:
 * - Reads CSV files containing DeepDAO participation data
 * - Processes TWO separate DeepDAO datasets:
 *   1. Transaction data (DEEPDAO_FILES.TRANSACTIONS)
 *   2. DAO participation data (DEEPDAO_FILES.PARTICIPATION)
 * - Awards points based on the number of DAOs each address has participated in
 * - Outputs a JSON file with account scores and statistical analysis
 *
 * OUTPUT FILE: ScoreSheetDeepDAO.json (configurable in config.ts)
 *
 * USE CASE:
 * - Score accounts based purely on DAO ecosystem involvement
 * - Identify active DAO participants and governance contributors
 * - Useful for airdrops targeting DAO-engaged users
 *
 * DATA SOURCES:
 * - DeepDAO Transactions: Primary transaction data from DAO interactions
 * - DeepDAO Participation: Additional DAO membership/participation data
 * - Duplicates between datasets are identified and skipped
 *
 * CUSTOMIZATION:
 * - Change input files in DEEPDAO_FILES (config.ts)
 * - Modify SCORE_THRESHOLDS to track different score ranges (config.ts)
 * - Adjust CSV_COLUMNS.DEEPDAO if your CSV structure differs (config.ts)
 *
 * HOW TO RUN:
 * npm run deepdao
 * or: npx ts-node scripts/dataMinerDeepDAO.ts
 */

import * as fs from "fs";
import { parse } from "csv-parse/sync";
import { AccountObject, DeepDAORecord } from "./types";
import { CSV_SOURCE_DIRECTORY, OUTPUT_FILES, OUTPUT_DIRECTORY, DEEPDAO_FILES, SCORE_THRESHOLDS, CSV_PARSE_OPTIONS, CSV_COLUMNS } from "./config";

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

/**
 * Calculate the median value of an array of numbers
 *
 * @param arr - Array of numbers to calculate median for
 * @returns The median value (middle value for odd length, average of two middle values for even length)
 */
const median = (arr: number[]): number => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

// ====================================================================
// MAIN EXECUTION FUNCTION
// ====================================================================

/**
 * Main function - orchestrates the DeepDAO scoring process
 *
 * EXECUTION FLOW:
 * 1. Parse DeepDAO Transactions CSV (first dataset)
 * 2. Parse DeepDAO Participation CSV (second dataset)
 * 3. Merge data, avoiding duplicates
 * 4. Write results to JSON file
 * 5. Output comprehensive statistics to console
 *
 * SCORING LOGIC:
 * - Score = number of DAOs the address has participated in
 * - Accounts appearing in both datasets are not double-counted
 * - The "number_of_daos" field from CSV becomes the score
 *
 * OUTPUT:
 * - JSON file with array of {account, score} objects
 * - Console logs with statistical analysis and score distribution
 */
async function main(): Promise<void> {
  console.log("dataminer DeepDAO only starting");

  // ====================================================================
  // STATE VARIABLES
  // ====================================================================

  /**
   * Main data structures for tracking accounts and scores
   */
  let accounts: AccountObject[] = []; // Final array of all unique accounts with their scores
  let overAllScore: number = 0; // Sum of all scores across all accounts
  let scores: number[] = []; // Array of individual scores for statistical analysis
  let deepDAONumberOfAccounts: number = 0; // Count of unique accounts found
  let totalScoreDeepDAO: number = 0; // Total cumulative score
  let highestDeepDAOscore: number = 0; // Highest individual account score

  /**
   * Counters for score distribution analysis
   * Track how many accounts exceed each threshold defined in SCORE_THRESHOLDS
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

  /**
   * Track duplicate entries between the two DeepDAO datasets
   * Helps identify data quality and overlap
   */
  let numberDouplicate: number = 0;

  // ====================================================================
  // PARSE DEEPDAO TRANSACTIONS DATA (First Dataset)
  // ====================================================================

  /**
   * Process the first DeepDAO CSV file containing transaction data
   * This is the primary data source for DAO participation
   */
  console.log("Parsing DeepDAO data");

  // Read the first DeepDAO CSV file from disk
  const deepDAOFileContent = await fs.readFileSync(__dirname + CSV_SOURCE_DIRECTORY + DEEPDAO_FILES.TRANSACTIONS);

  // Parse CSV into array of objects using settings from config
  const deepDAOScores = (await parse(deepDAOFileContent, CSV_PARSE_OPTIONS.DEEPDAO)) as any[];

  /**
   * Process each record in the DeepDAO Transactions dataset
   * Each record represents an account's participation in DAOs
   */
  let recordLength = deepDAOScores.length;
  for (let i = 0; i < recordLength; i++) {
    // Extract the Ethereum address from the CSV
    let deployerAccount = deepDAOScores[i][CSV_COLUMNS.DEEPDAO.ADDRESS];

    // Extract the DAO participation count (this becomes the score)
    let deploymentCount = deepDAOScores[i][CSV_COLUMNS.DEEPDAO.NUMBER_OF_DAOS];

    // Create a new account entry
    // Note: This is the first dataset, so we don't check for existing accounts yet
    let accountObject: AccountObject = {
      account: deployerAccount,
      score: parseInt(deploymentCount),
    };

    // Add the account to our main array
    accounts.push(accountObject);

    // Track scores for statistical analysis
    scores.push(parseInt(deploymentCount));

    // Update cumulative statistics
    overAllScore += parseInt(deploymentCount);
    deepDAONumberOfAccounts = recordLength;
    totalScoreDeepDAO += parseInt(deploymentCount);
    if (highestDeepDAOscore < parseInt(deploymentCount)) {
      highestDeepDAOscore = parseInt(deploymentCount);
    }

    /**
     * Count how many accounts exceed each score threshold
     * Used for distribution analysis in the final report
     */
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[0]) {
      numberOfAccountsAbove10++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[1]) {
      numberOfAccountsAbove20++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[2]) {
      numberOfAccountsAbove30++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[3]) {
      numberOfAccountsAbove50++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[4]) {
      numberOfAccountsAbove75++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[5]) {
      numberOfAccountsAbove100++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[6]) {
      numberOfAccountsAbove125++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[7]) {
      numberOfAccountsAbove150++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[8]) {
      numberOfAccountsAbove175++;
    }
    if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[9]) {
      numberOfAccountsAbove200++;
    }
  }

  // ====================================================================
  // PARSE DEEPDAO PARTICIPATION DATA (Second Dataset)
  // ====================================================================

  /**
   * Process the second DeepDAO CSV file containing participation data
   * This provides additional DAO membership information
   * Accounts from this dataset that already exist (from first dataset) are skipped
   */
  console.log("Parsing DeepDAO Participation data");

  // Read the second DeepDAO CSV file from disk
  const deepDAOFileContent1 = await fs.readFileSync(__dirname + CSV_SOURCE_DIRECTORY + DEEPDAO_FILES.PARTICIPATION);

  // Parse CSV into array of objects
  const deepDAOScores1 = (await parse(deepDAOFileContent1, CSV_PARSE_OPTIONS.DEEPDAO)) as any[];

  recordLength = deepDAOScores1.length;

  // Track scores from this dataset separately for statistics
  let deepDAOScoresArray: number[] = [];

  /**
   * Process each record in the DeepDAO Participation dataset
   * Check for duplicates before adding accounts
   */
  for (let i = 0; i < recordLength; i++) {
    // Extract the Ethereum address
    let deployerAccount = deepDAOScores1[i][CSV_COLUMNS.DEEPDAO.ADDRESS];

    // Extract the DAO participation count
    let deploymentCount = deepDAOScores1[i][CSV_COLUMNS.DEEPDAO.NUMBER_OF_DAOS];

    // Check if this account already exists from the first dataset
    let existingAccount = accounts.find((accountObject) => accountObject.account === deployerAccount);

    if (existingAccount === undefined) {
      // NEW ACCOUNT: Not found in first dataset, add it now
      let accountObject: AccountObject = {
        account: deployerAccount,
        score: parseInt(deploymentCount),
      };

      // Add the new account to our array
      accounts.push(accountObject);

      // Track scores for statistical analysis
      scores.push(parseInt(deploymentCount));
      deepDAOScoresArray.push(parseInt(deploymentCount));

      // Update cumulative statistics
      overAllScore += parseInt(deploymentCount);
      deepDAONumberOfAccounts = recordLength;
      totalScoreDeepDAO += parseInt(deploymentCount);
      if (highestDeepDAOscore < parseInt(deploymentCount)) {
        highestDeepDAOscore = parseInt(deploymentCount);
      }

      /**
       * Update threshold counters for distribution analysis
       * Only for new accounts (not duplicates)
       */
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[0]) {
        numberOfAccountsAbove10++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[1]) {
        numberOfAccountsAbove20++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[2]) {
        numberOfAccountsAbove30++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[3]) {
        numberOfAccountsAbove50++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[4]) {
        numberOfAccountsAbove75++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[5]) {
        numberOfAccountsAbove100++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[6]) {
        numberOfAccountsAbove125++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[7]) {
        numberOfAccountsAbove150++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[8]) {
        numberOfAccountsAbove175++;
      }
      if (parseInt(deploymentCount) >= SCORE_THRESHOLDS[9]) {
        numberOfAccountsAbove200++;
      }
    } else {
      /**
       * DUPLICATE ACCOUNT: Already exists from first dataset
       * Skip adding it to avoid double-counting
       * Track the duplicate count for reporting
       */
      numberDouplicate++;
    }
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
  fs.writeFileSync(OUTPUT_DIRECTORY + OUTPUT_FILES.DEEPDAO_SCORE, jsonData);
  console.log("Data JSONified into " + OUTPUT_FILES.DEEPDAO_SCORE + "!!!");

  // ====================================================================
  // STATISTICAL REPORTING
  // ====================================================================

  /**
   * Output comprehensive statistics about the scoring results
   * This helps understand the distribution and characteristics of the DAO participation data
   */
  console.log("The total number of accounts in the DeepDAO data is: ");
  console.log(deepDAONumberOfAccounts);
  console.log("The total score from the DeepDAO data is: ");
  console.log(totalScoreDeepDAO);
  console.log("The highest score in the DeepDAO data is: ");
  console.log(highestDeepDAOscore);
  console.log("The average score for the DeepDAO data is: ");
  console.log(overAllScore / accounts.length);
  console.log("The median score for the DeepDAO data is: ");
  console.log(median(scores));

  /**
   * Calculate score distribution by ranges
   * Shows how accounts are distributed across different score buckets
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
   * Helps understand the DAO participation distribution curve
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
  console.log("The total number of accounts with a score less than 10: ");
  console.log(deepDAONumberOfAccounts - totalAbove10);

  /**
   * Report on data quality: how many duplicates were found
   * A high duplicate count indicates significant overlap between the two datasets
   */
  console.log("The amount of dublicated data inside the Deep DAO Participation data:");
  console.log(numberDouplicate);
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
