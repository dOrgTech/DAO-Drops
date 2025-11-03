/**
 * ====================================================================
 * DAO DROPS - CONTRACT DEPLOYMENT SCORER
 * ====================================================================
 *
 * This script generates account scores based ONLY on smart contract
 * deployment activity on the Ethereum blockchain.
 *
 * WHAT IT DOES:
 * - Reads CSV files containing contract deployment data
 * - Identifies addresses that have deployed smart contracts
 * - Awards points based on the number of unique contracts deployed
 * - Outputs a JSON file with account scores and statistical analysis
 *
 * OUTPUT FILE: ScoreSheetDeployment.json (configurable in config.ts)
 *
 * USE CASE:
 * - Score accounts based purely on builder/developer activity
 * - Identify active smart contract developers in the ecosystem
 * - Useful for airdrops targeting technical contributors and builders
 * - Recognize accounts with significant on-chain development presence
 *
 * SCORING LOGIC:
 * - Score = number of unique contracts deployed by the address
 * - No multipliers applied (unlike dataMinerFull.ts)
 * - Raw deployment count becomes the account score
 *
 * CUSTOMIZATION:
 * - Change input file in DEPLOYMENT_FILES (config.ts)
 * - Modify SCORE_THRESHOLDS to track different score ranges (config.ts)
 * - Adjust CSV_COLUMNS.DEPLOYMENT if your CSV structure differs (config.ts)
 *
 * HOW TO RUN:
 * npm run deployments
 * or: npx ts-node scripts/dataMinerDeployments.ts
 */

import * as fs from "fs";
import { parse } from "csv-parse/sync";
import { AccountObject, DeployerRecord } from "./types";
import { CSV_SOURCE_DIRECTORY, OUTPUT_FILES, OUTPUT_DIRECTORY, DEPLOYMENT_FILES, SCORE_THRESHOLDS, CSV_PARSE_OPTIONS, CSV_COLUMNS } from "./config";

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
 * Main function - orchestrates the contract deployment scoring process
 *
 * EXECUTION FLOW:
 * 1. Parse contract deployment CSV file
 * 2. Extract deployer addresses and deployment counts
 * 3. Create account objects with scores
 * 4. Write results to JSON file
 * 5. Output comprehensive statistics to console
 *
 * SCORING LOGIC:
 * - Score = number of unique contracts deployed
 * - Each deployer gets one entry with their total deployment count
 * - No filtering or thresholds applied (all deployers included)
 *
 * OUTPUT:
 * - JSON file with array of {account, score} objects
 * - Console logs with statistical analysis and score distribution
 */
async function main(): Promise<void> {
  console.log("dataminer Contract Deployments only starting");

  // ====================================================================
  // STATE VARIABLES
  // ====================================================================

  /**
   * Main data structures for tracking accounts and scores
   */
  let accounts: AccountObject[] = []; // Final array of all deployer accounts with their scores
  let overAllScore: number = 0; // Sum of all deployment counts
  let scores: number[] = []; // Array of individual scores for statistical analysis
  let contractDeployerNumberOfAccounts: number = 0; // Count of unique deployer accounts
  let totalScoreContractDeployer: number = 0; // Total cumulative deployment count
  let highestContractDeployerScore: number = 0; // Highest individual deployment count

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

  // ====================================================================
  // PARSE CONTRACT DEPLOYMENT DATA
  // ====================================================================

  /**
   * Read and parse the contract deployment CSV file
   * This file contains addresses that have deployed contracts and their deployment counts
   */
  const deployerFileContent = await fs.readFileSync(__dirname + CSV_SOURCE_DIRECTORY + DEPLOYMENT_FILES.CONTRACT_DEPLOYER);

  console.log("Parsing contract deployment data");
  const deployerRecords = (await parse(deployerFileContent, CSV_PARSE_OPTIONS.DEPLOYMENT)) as any[];

  /**
   * Process each record in the deployment CSV
   * Each record represents one deployer address and their deployment count
   */
  let recordLength = deployerRecords.length;
  for (let i = 0; i < recordLength; i++) {
    // Extract the deployer's Ethereum address from the CSV
    let deployerAccount = deployerRecords[i][CSV_COLUMNS.DEPLOYMENT.CODER];

    // Extract the number of unique contracts this account has deployed
    let deploymentCount = deployerRecords[i][CSV_COLUMNS.DEPLOYMENT.UNIQUE_CONTRACT];

    // Create an account object with the deployment count as the score
    // Note: Score = raw deployment count (no multipliers in this script)
    let accountObject: AccountObject = {
      account: deployerAccount,
      score: parseInt(deploymentCount),
    };

    // Add the deployer account to our main array
    accounts.push(accountObject);

    // Track scores for statistical analysis
    scores.push(parseInt(deploymentCount));

    // Update cumulative statistics
    overAllScore += parseInt(deploymentCount);
    contractDeployerNumberOfAccounts = recordLength;
    totalScoreContractDeployer += parseInt(deploymentCount);
    if (highestContractDeployerScore < parseInt(deploymentCount)) {
      highestContractDeployerScore = parseInt(deploymentCount);
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
  // OUTPUT GENERATION
  // ====================================================================

  /**
   * Convert the accounts array to JSON and save to file
   * The output file will contain an array of {account, score} objects
   * where score = number of unique contracts deployed
   */
  console.log("JSONifying data");
  var jsonData = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(OUTPUT_DIRECTORY + OUTPUT_FILES.DEPLOYMENT_SCORE, jsonData);
  console.log("Data JSONified into " + OUTPUT_FILES.DEPLOYMENT_SCORE + "!!!");

  // ====================================================================
  // STATISTICAL REPORTING
  // ====================================================================

  /**
   * Output comprehensive statistics about the deployment scoring results
   * This helps understand the distribution of builder activity
   */
  console.log("The total number of accounts in the Contract Deployer data is: ");
  console.log(contractDeployerNumberOfAccounts);
  console.log("The total score from the Contract Deployer data is: ");
  console.log(totalScoreContractDeployer);
  console.log("The highest score in the Contract Deployer data is: ");
  console.log(highestContractDeployerScore);
  console.log("The average score for the Contract Deployer data is: ");
  console.log(overAllScore / accounts.length);
  console.log("The median score for the Contract Deployer data is: ");
  console.log(median(scores));

  /**
   * Calculate score distribution by ranges
   * Shows how deployers are distributed across different deployment count buckets
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
   * Shows exactly how many accounts fall into each deployment count range
   * Helps understand the builder activity distribution curve
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
  console.log(contractDeployerNumberOfAccounts - totalAbove10);
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
