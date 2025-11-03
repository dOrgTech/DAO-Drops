/**
 * ====================================================================
 * DAO DROPS - FULL COMBINED SCORER
 * ====================================================================
 *
 * This is the MAIN scoring script that combines ALL data sources:
 * - POAP event attendance
 * - DeepDAO DAO participation
 * - Smart contract deployments
 *
 * WHAT IT DOES:
 * - Processes all three data sources and merges them
 * - Applies different scoring rules for each data type
 * - Filters accounts based on deployment threshold
 * - Normalizes final scores into buckets
 * - Outputs a comprehensive JSON score sheet
 *
 * OUTPUT FILE: ScoreSheet.json (configurable in config.ts)
 *
 * USE CASE:
 * - Generate a holistic activity score for Ethereum accounts
 * - Identify truly engaged ecosystem participants
 * - Combine builder activity (deployments) + community engagement (POAPs) + governance (DAOs)
 * - Most comprehensive scoring for targeted airdrops
 *
 * SCORING LOGIC (Important - Read Carefully!):
 * 1. Contract Deployments:
 *    - Score = deployment_count × CONTRACT_DEPLOYMENT_MULTIPLIER
 *    - Only accounts with > MINIMUM_DEPLOYMENTS_THRESHOLD are included
 *    - This is different from dataMinerDeployments.ts!
 *
 * 2. DeepDAO Participation:
 *    - Score = number of DAOs participated in
 *    - Adds to existing account score if account found in deployments
 *
 * 3. POAP Events:
 *    - Score = number of events × POAP_SCORE_PER_EVENT
 *    - Adds to existing account score if account already exists
 *
 * 4. Score Normalization:
 *    - Final scores are normalized into discrete buckets
 *    - Configured via SCORE_NORMALIZATION_BUCKETS
 *    - Smooths the distribution for fairer allocation
 *
 * CUSTOMIZATION:
 * - CONTRACT_DEPLOYMENT_MULTIPLIER: adjust weight of deployments (config.ts)
 * - MINIMUM_DEPLOYMENTS_THRESHOLD: minimum deployments to be included (config.ts)
 * - POAP_SCORE_PER_EVENT: points per event attended (config.ts)
 * - SCORE_NORMALIZATION_BUCKETS: how final scores are bucketed (config.ts)
 * - Add/remove data sources by modifying the parsing sections below
 *
 * HOW TO RUN:
 * npm run full
 * or: npx ts-node scripts/dataMinerFull.ts
 */

import * as fs from "fs";
import { parse } from "csv-parse/sync";
import { AccountObject, DeepDAORecord, DeployerRecord, POAPRecord } from "./types";
import {
  CSV_SOURCE_DIRECTORY,
  OUTPUT_FILES,
  OUTPUT_DIRECTORY,
  DEEPDAO_FILES,
  DEPLOYMENT_FILES,
  POAP_EVENT_FILES,
  POAP_SCORE_PER_EVENT,
  CONTRACT_DEPLOYMENT_MULTIPLIER,
  MINIMUM_DEPLOYMENTS_THRESHOLD,
  SCORE_NORMALIZATION_BUCKETS,
  CSV_PARSE_OPTIONS,
  CSV_COLUMNS,
} from "./config";

// ====================================================================
// STATE VARIABLES
// ====================================================================

/**
 * Main data structures for tracking accounts and scores
 * These are shared across all data source parsers
 */
let accounts: AccountObject[] = []; // Final array of all unique accounts with combined scores
let scores: number[] = []; // Array of all individual scores for statistical analysis
let poapScoresArray: number[] = []; // POAP scores for median calculation
let overAllScore: number = 0; // Sum of all scores across all accounts

/**
 * Contract Deployment Statistics
 * Track metrics specific to the deployment data source
 */
let contractDeployerNumberOfAccounts: number = 0;
let totalScoreContractDeployer: number = 0;
let highestContractDeployerScore: number = 0;
let averageScoreDeployer: number = 0;
let medianScoreDeployer: number = 0;

/**
 * Track duplicate entries between DeepDAO datasets
 */
let numberDouplicate: number = 0;

/**
 * DeepDAO Statistics
 * Track metrics specific to the DAO participation data source
 */
let deepDAONumberOfAccounts: number = 0;
let totalScoreDeepDAO: number = 0;
let highestDeepDAOscore: number = 0;
let averageScoreDeepDAO: number = 0;
let medianScoreDeepDAO: number = 0;

/**
 * POAP Event Statistics
 * Track metrics specific to the event attendance data source
 */
let poapNumberOfAccounts: number = 0;
let totalScorePOAP: number = 0;
let highestPOAPscore: number = 0;
let averageScorePOAP: number = 0;
let medianScorePOAP: number = 0;

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
// CSV PARSING FUNCTIONS
// ====================================================================

/**
 * Parse a POAP event CSV file and add scores to existing accounts
 *
 * This function is called for each POAP event file and adds points to accounts
 * that already exist in the accounts array (from deployment/DAO data).
 * If an account doesn't exist yet, it creates a new entry.
 *
 * @param fileLocation - Name of the CSV file to parse (relative to CSV_SOURCE_DIRECTORY)
 *
 * SCORING LOGIC:
 * - Awards POAP_SCORE_PER_EVENT points per event attended
 * - Adds to existing scores (for accounts already in the system)
 * - Creates new accounts if not found (though typically accounts start from deployment data)
 *
 * INTEGRATION WITH FULL SCORING:
 * - POAP scores are added on top of deployment and DAO participation scores
 * - Accounts can accumulate POAP points across multiple events
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

    // Check if this account already exists from deployment/DAO data
    let existingAccount = accounts.find((accountObject) => accountObject.account === poapAccount);

    let currentAccountScore: number = 0;

    if (existingAccount === undefined) {
      /**
       * NEW ACCOUNT: Not found in deployment/DAO data
       * This means they attended events but didn't deploy contracts or participate in DAOs
       * Still create an entry for them
       */
      poapNumberOfAccounts++;
      let accountObject: AccountObject = {
        account: poapAccount,
        score: POAP_SCORE_PER_EVENT,
      };
      accounts.push(accountObject);
      overAllScore += POAP_SCORE_PER_EVENT;
      currentAccountScore = POAP_SCORE_PER_EVENT;
    } else {
      /**
       * EXISTING ACCOUNT: Already has deployment/DAO score
       * Add POAP points to their existing score
       * This is how scores accumulate across data sources
       */
      existingAccount.score += POAP_SCORE_PER_EVENT;
      overAllScore += POAP_SCORE_PER_EVENT;
      currentAccountScore = existingAccount.score;
    }

    // Track scores for statistical analysis
    scores.push(currentAccountScore);
    poapScoresArray.push(currentAccountScore);

    // Update POAP-specific statistics
    totalScorePOAP += parseInt(currentAccountScore.toString());
    if (highestPOAPscore < parseInt(currentAccountScore.toString())) {
      highestPOAPscore = parseInt(currentAccountScore.toString());
    }
  }

  // Calculate POAP statistical metrics
  averageScorePOAP = totalScorePOAP / poapNumberOfAccounts;
  medianScorePOAP = median(poapScoresArray);
};

// ====================================================================
// MAIN EXECUTION FUNCTION
// ====================================================================

/**
 * Main function - orchestrates the FULL combined scoring process
 *
 * EXECUTION ORDER (IMPORTANT!):
 * 1. DeepDAO Transactions (first dataset)
 * 2. DeepDAO Participation (second dataset, merges with first)
 * 3. Contract Deployments (filtered by threshold, applies multiplier)
 * 4. POAP Events (all event files, adds to existing accounts)
 * 5. Score Normalization (buckets the final scores)
 * 6. JSON Output and Statistical Reporting
 *
 * WHY THIS ORDER:
 * - Start with DAO data to identify governance participants
 * - Add deployment data to identify builders (with filtering)
 * - Layer on POAP data for community engagement
 * - Finally normalize to smooth distribution
 *
 * OUTPUT:
 * - JSON file with array of {account, score} objects
 * - Console logs with detailed statistics from each data source
 */
async function main(): Promise<void> {
  console.log("dataminer starting");

  // ====================================================================
  // PARSE DEEPDAO TRANSACTIONS DATA (First Dataset)
  // ====================================================================

  /**
   * Process the first DeepDAO CSV file containing transaction data
   * This is the starting point for the combined scoring
   */
  console.log("Parsing DeepDAO TX data");

  const deepDAOFileContent = await fs.readFileSync(__dirname + CSV_SOURCE_DIRECTORY + DEEPDAO_FILES.TRANSACTIONS);

  const deepDAOScores = (await parse(deepDAOFileContent, CSV_PARSE_OPTIONS.DEEPDAO)) as any[];

  let deepDAOScoresArray: number[] = [];

  /**
   * Process each record in the DeepDAO Transactions dataset
   */
  let recordLength = deepDAOScores.length;
  for (let i = 0; i < recordLength; i++) {
    // Extract the Ethereum address
    let account = deepDAOScores[i][CSV_COLUMNS.DEEPDAO.ADDRESS];

    // Extract the DAO participation count (becomes the score)
    let count = deepDAOScores[i][CSV_COLUMNS.DEEPDAO.NUMBER_OF_DAOS];

    // Check if this account already exists (shouldn't for first dataset)
    let existingAccount = accounts.find((accountObject) => accountObject.account === account);

    if (existingAccount === undefined) {
      // NEW ACCOUNT: Create entry with DAO participation score
      let accountObject: AccountObject = {
        account: account,
        score: parseInt(count),
      };
      accounts.push(accountObject);
    } else {
      // EXISTING ACCOUNT: Add to their score (in case of duplicates within dataset)
      existingAccount.score += parseInt(count);
    }

    // Track scores for statistical analysis
    scores.push(parseInt(count));
    deepDAOScoresArray.push(parseInt(count));

    // Update cumulative statistics
    overAllScore += parseInt(count);
    deepDAONumberOfAccounts = recordLength;
    totalScoreDeepDAO += parseInt(count);
    if (highestDeepDAOscore < parseInt(count)) {
      highestDeepDAOscore = parseInt(count);
    }
  }

  // Calculate DeepDAO statistical metrics
  averageScoreDeepDAO = totalScoreDeepDAO / recordLength;
  medianScoreDeepDAO = median(deepDAOScoresArray);

  // ====================================================================
  // PARSE DEEPDAO PARTICIPATION DATA (Second Dataset)
  // ====================================================================

  /**
   * Process the second DeepDAO CSV file containing participation data
   * Merges with the first dataset, skipping duplicates
   */
  console.log("Parsing DeepDAO DAO Participation data");

  const deepDAOFileContent1 = await fs.readFileSync(__dirname + CSV_SOURCE_DIRECTORY + DEEPDAO_FILES.PARTICIPATION);

  const deepDAOScores1 = (await parse(deepDAOFileContent1, CSV_PARSE_OPTIONS.DEEPDAO)) as any[];

  recordLength = deepDAOScores1.length;

  /**
   * Process each record in the DeepDAO Participation dataset
   * Check for duplicates from the first dataset
   */
  for (let i = 0; i < recordLength; i++) {
    // Extract the Ethereum address
    let account = deepDAOScores1[i][CSV_COLUMNS.DEEPDAO.ADDRESS];

    // Extract the DAO participation count
    let count = deepDAOScores1[i][CSV_COLUMNS.DEEPDAO.NUMBER_OF_DAOS];

    // Check if this account already exists from the first dataset
    let existingAccount = accounts.find((accountObject) => accountObject.account === account);

    if (existingAccount === undefined) {
      // NEW ACCOUNT: Not found in first dataset, add it now
      let accountObject: AccountObject = {
        account: account,
        score: parseInt(count),
      };
      accounts.push(accountObject);

      // Track scores for statistical analysis
      scores.push(parseInt(count));
      deepDAOScoresArray.push(parseInt(count));

      // Update cumulative statistics
      overAllScore += parseInt(count);
      deepDAONumberOfAccounts = recordLength;
      totalScoreDeepDAO += parseInt(count);
      if (highestDeepDAOscore < parseInt(count)) {
        highestDeepDAOscore = parseInt(count);
      }
    } else {
      // DUPLICATE: Already exists from first dataset, skip it
      numberDouplicate++;
    }
  }

  // Update DeepDAO statistical metrics
  averageScoreDeepDAO = totalScoreDeepDAO / recordLength;
  medianScoreDeepDAO = median(deepDAOScoresArray);

  // ====================================================================
  // PARSE CONTRACT DEPLOYMENT DATA
  // ====================================================================

  /**
   * Process contract deployment data
   * IMPORTANT: This applies a multiplier and threshold filter!
   */
  const deployerFileContent = await fs.readFileSync(__dirname + CSV_SOURCE_DIRECTORY + DEPLOYMENT_FILES.CONTRACT_DEPLOYER);

  console.log("Parsing contract deployment data");
  const deployerRecords = (await parse(deployerFileContent, CSV_PARSE_OPTIONS.DEPLOYMENT)) as any[];

  let deploymentScores: number[] = [];

  /**
   * Process each deployer record
   * Only include accounts that meet the minimum deployment threshold
   */
  recordLength = deployerRecords.length;
  for (let i = 0; i < recordLength; i++) {
    // Extract the deployer's Ethereum address
    let deployerAccount = deployerRecords[i][CSV_COLUMNS.DEPLOYMENT.CODER];

    // Extract the number of unique contracts deployed
    let deploymentCount = deployerRecords[i][CSV_COLUMNS.DEPLOYMENT.UNIQUE_CONTRACT];

    /**
     * THRESHOLD FILTER: Only include accounts with enough deployments
     * This is configurable via MINIMUM_DEPLOYMENTS_THRESHOLD in config.ts
     * Helps filter out noise and focus on serious builders
     */
    if (parseInt(deploymentCount) > MINIMUM_DEPLOYMENTS_THRESHOLD) {
      /**
       * CREATE ACCOUNT WITH MULTIPLIED SCORE
       * CRITICAL: Score = deployment_count × CONTRACT_DEPLOYMENT_MULTIPLIER
       * This gives deployments more weight than DAO/POAP activity
       * Adjust CONTRACT_DEPLOYMENT_MULTIPLIER in config.ts to change this
       */
      let accountObject: AccountObject = {
        account: deployerAccount,
        score: parseInt(deploymentCount) * CONTRACT_DEPLOYMENT_MULTIPLIER,
      };

      // Add the deployer account to our main array
      accounts.push(accountObject);

      // Track scores for statistical analysis
      scores.push(parseInt(deploymentCount));
      deploymentScores.push(parseInt(deploymentCount));

      // Update cumulative statistics
      overAllScore += parseInt(deploymentCount);
      contractDeployerNumberOfAccounts = accounts.length;
      totalScoreContractDeployer += parseInt(deploymentCount);
      if (highestContractDeployerScore < parseInt(deploymentCount)) {
        highestContractDeployerScore = parseInt(deploymentCount);
      }

      // Calculate deployment statistical metrics
      averageScoreDeployer = totalScoreContractDeployer / recordLength;
      medianScoreDeployer = median(deploymentScores);
    }
  }

  // ====================================================================
  // PARSE POAP EVENT DATA
  // ====================================================================

  /**
   * Process all POAP event files from config
   * This adds event attendance points to existing accounts
   * (or creates new accounts for event-only participants)
   */
  for (const eventFile of POAP_EVENT_FILES) {
    await generalizedPOAPparse(eventFile);
  }

  // ====================================================================
  // SCORE NORMALIZATION
  // ====================================================================

  /**
   * Apply score normalization to bucket final scores
   *
   * WHY NORMALIZE:
   * - Smooths the distribution to avoid outliers
   * - Creates discrete score tiers for fairer allocation
   * - Prevents extreme scores from skewing results
   *
   * HOW IT WORKS:
   * - Scores are mapped to buckets defined in SCORE_NORMALIZATION_BUCKETS
   * - Each bucket has a min, max, and normalized value
   * - Accounts within a bucket get assigned the normalized value
   *
   * CUSTOMIZATION:
   * - Modify SCORE_NORMALIZATION_BUCKETS in config.ts to change bucketing
   * - Add/remove buckets to create more/fewer tiers
   */
  console.log("JSONifying data");

  /**
   * Loop through all accounts and normalize their scores
   */
  for (let i = 0; i < accounts.length; i++) {
    const currentScore = accounts[i].score;

    /**
     * Find the appropriate normalization bucket for this score
     * Check each bucket's conditions until we find a match
     */
    for (const bucket of SCORE_NORMALIZATION_BUCKETS) {
      let matches = false;

      if (bucket.min === null) {
        // Special case: score < max (for lowest bucket)
        matches = currentScore < bucket.max;
      } else if (bucket.max === Infinity) {
        // Special case: score > min (for highest bucket)
        matches = currentScore > bucket.min;
      } else {
        /**
         * Standard case: min < score < max (exclusive boundaries)
         * Note: Boundary values themselves are NOT normalized
         * Example: score of exactly 30 won't match bucket (20, 30, 30)
         */
        matches = currentScore > bucket.min && currentScore < bucket.max;
      }

      if (matches) {
        /**
         * NORMALIZE THE SCORE
         * Replace the account's score with the bucket's normalized value
         * This creates discrete scoring tiers
         */
        accounts[i].score = bucket.normalized;
        break; // Stop after first match
      }
    }
  }

  // ====================================================================
  // OUTPUT GENERATION
  // ====================================================================

  /**
   * Convert the accounts array to JSON and save to file
   * The output file will contain an array of {account, score} objects
   * with combined and normalized scores from all data sources
   */
  var jsonData = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(OUTPUT_DIRECTORY + OUTPUT_FILES.FULL_SCORE, jsonData);
  console.log("Data JSONified into " + OUTPUT_FILES.FULL_SCORE + "!!!");

  // ====================================================================
  // STATISTICAL REPORTING
  // ====================================================================

  /**
   * Output comprehensive statistics about the combined scoring results
   * This provides visibility into how each data source contributed
   */
  console.log("The current total score is: ");
  console.log(overAllScore);
  console.log("The overall average score is: ");
  console.log(overAllScore / accounts.length);
  console.log("The overall median score is: ");
  console.log(median(scores));

  /**
   * ACCOUNT TOTALS AND OVERLAP ANALYSIS
   * Shows how accounts are distributed across data sources
   */
  console.log("the total number of accounts in the final Score Sheet is: ");
  console.log(accounts.length);
  console.log("the total number of accounts parsed over all data sources: ");
  console.log(contractDeployerNumberOfAccounts + deepDAONumberOfAccounts + poapNumberOfAccounts);
  console.log("the total number of overlapping accounts is : ");
  console.log(contractDeployerNumberOfAccounts + deepDAONumberOfAccounts + poapNumberOfAccounts - accounts.length);

  /**
   * CONTRACT DEPLOYER STATISTICS
   * Metrics specific to the deployment data source
   */
  console.log("The total number of accounts in the Contract Deployer data is: ");
  console.log(contractDeployerNumberOfAccounts);
  console.log("The total score from the Contract Deployer data is: ");
  console.log(totalScoreContractDeployer);
  console.log("The highest score in the Contract Deployer data is: ");
  console.log(highestContractDeployerScore);
  console.log("The average score for the Contract Deployer data is: ");
  console.log(averageScoreDeployer);
  console.log("The median score for the Contract Deployer data is: ");
  console.log(medianScoreDeployer);

  /**
   * DEEPDAO STATISTICS
   * Metrics specific to the DAO participation data source
   */
  console.log("The total number of accounts in the DeepDAO data is: ");
  console.log(deepDAONumberOfAccounts);
  console.log("The total score from the DeepDAO data is: ");
  console.log(totalScoreDeepDAO);
  console.log("The highest score in the DeepDAO data is: ");
  console.log(highestDeepDAOscore);
  console.log("The average score for the DeepDAO data is: ");
  console.log(averageScoreDeepDAO);
  console.log("The median score for the DeepDAO data is: ");
  console.log(medianScoreDeepDAO);

  /**
   * POAP EVENT STATISTICS
   * Metrics specific to the event attendance data source
   */
  console.log("The total number of accounts in the POAP data is: ");
  console.log(poapNumberOfAccounts);
  console.log("The total score from the POAP data is: ");
  console.log(totalScorePOAP);
  console.log("The highest score in the POAP data is: ");
  console.log(highestPOAPscore);
  console.log("The average score for the POAP data is: ");
  console.log(averageScorePOAP);
  console.log("The median score for the POAP data is: ");
  console.log(medianScorePOAP);

  /**
   * DATA QUALITY REPORT
   * Shows how many duplicates were found between DeepDAO datasets
   * Helpful for understanding data overlap and quality
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
