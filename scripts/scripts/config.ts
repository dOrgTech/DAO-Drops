/**
 * ====================================================================
 * DAO DROPS SCORING SYSTEM - CONFIGURATION FILE
 * ====================================================================
 *
 * This configuration file contains all customizable settings for the
 * DAO Drops account scoring system. Modify these values to customize
 * the scoring behavior for your own deployment.
 *
 * OVERVIEW:
 * The scoring system analyzes Ethereum accounts based on three data sources:
 * 1. POAP (Proof of Attendance Protocol) - Ethereum event attendance
 * 2. DeepDAO - DAO participation metrics
 * 3. Contract Deployments - Smart contract deployment activity
 *
 * Each data source contributes to an overall activity score for each account.
 */

// ====================================================================
// FILE PATHS & DIRECTORIES
// ====================================================================

/**
 * CSV_SOURCE_DIRECTORY
 * The directory containing all CSV data source files.
 * This is relative to the script execution directory.
 */
export const CSV_SOURCE_DIRECTORY = "/csv_src/";

/**
 * OUTPUT_DIRECTORY
 * The directory where generated JSON score sheets will be saved.
 * This is relative to the project root.
 */
export const OUTPUT_DIRECTORY = "./scoreSheets/";

// ====================================================================
// OUTPUT FILE NAMES
// ====================================================================

/**
 * Output file names for the generated score sheets.
 * Each script generates a different score sheet based on data sources used.
 */
export const OUTPUT_FILES = {
  /** Full scoring using all data sources */
  FULL_SCORE: "ScoreSheet.json",

  /** Score based only on POAP event attendance */
  POAP_SCORE: "ScoreSheetPOAP.json",

  /** Score based only on DeepDAO DAO participation */
  DEEPDAO_SCORE: "ScoreSheetDeepDAO.json",

  /** Score based only on contract deployments */
  DEPLOYMENT_SCORE: "ScoreSheetDeployment.json",
};

// ====================================================================
// DATA SOURCE FILES
// ====================================================================

/**
 * DEEPDAO_FILES
 * CSV files containing DeepDAO data for DAO participation analysis.
 */
export const DEEPDAO_FILES = {
  /** DeepDAO transaction data */
  TRANSACTIONS: "DeepDAO.csv",

  /** DeepDAO DAO participation data */
  PARTICIPATION: "DeepDAO1.csv",
};

/**
 * DEPLOYMENT_FILES
 * CSV files containing smart contract deployment data.
 */
export const DEPLOYMENT_FILES = {
  /** Contract deployer addresses and deployment counts */
  CONTRACT_DEPLOYER: "ContractDeployer.csv",
};

/**
 * POAP_EVENT_FILES
 * List of all POAP event CSV files to process.
 * Each file represents a different Ethereum event (conferences, hackathons, etc.)
 *
 * ADD OR REMOVE FILES HERE to customize which events are included in scoring.
 */
export const POAP_EVENT_FILES = [
  // DevCon Events
  "DevCon1.csv",
  "DevCon2.csv",
  "DevCon3.csv",
  "DevCon4.csv",
  "DevCon5.csv",
  "Devcon_Bogota.csv",

  // ETHBerlin Events
  "ETHBerlin.csv",
  "ETHBerlin2.csv",
  "ETHBerlinZwei.csv",

  // ETHBoston Events
  "ETHBOSTON1.csv",
  "ETHBOSTON2.csv",
  "ETHBOSTON3.csv",

  // ETHDenver Events
  "ETHDenver1.csv",
  "ETHDenver2.csv",
  "ETHDenver3.csv",

  // ETHIndia Events
  "ETHIndia.csv",
  "ETHIndia2.csv",
  "ETHIndia3.csv",

  // DappCon Events
  "Dappcon_2019.csv",
  "DappCon.csv",

  // EDCON Events
  "EDCON1.csv",
  "EDCON2.csv",

  // Other ETH Events
  "ETHCAPETOWN.csv",
  "EthCC.csv",
  "EthCC1.csv",
  "EthCC4.csv",
  "ETHNewYork.csv",
  "ETHParis.csv",
  "ETHWaterloo.csv",
];

// ====================================================================
// SCORING PARAMETERS
// ====================================================================

/**
 * POAP_SCORE_PER_EVENT
 * The number of points awarded for each POAP event attendance.
 * Default: 10 points per event
 */
export const POAP_SCORE_PER_EVENT = 10;

/**
 * CONTRACT_DEPLOYMENT_MULTIPLIER
 * Multiplier applied to contract deployment count in the full scoring system.
 * Default: 10x the number of deployments
 *
 * Note: This is only used in dataMinerFull.ts, not in dataMinerDeployments.ts
 */
export const CONTRACT_DEPLOYMENT_MULTIPLIER = 10;

/**
 * MINIMUM_DEPLOYMENTS_THRESHOLD
 * Minimum number of contract deployments required for an account to be included.
 * Accounts with fewer deployments will be excluded from the full scoring.
 * Default: 3 deployments
 *
 * Note: This filter is only applied in dataMinerFull.ts
 */
export const MINIMUM_DEPLOYMENTS_THRESHOLD = 3;

// ====================================================================
// SCORE NORMALIZATION BUCKETS (for dataMinerFull.ts)
// ====================================================================

/**
 * SCORE_NORMALIZATION_BUCKETS
 * Score ranges used to normalize final scores in the full scoring system.
 * Accounts are grouped into these buckets and assigned the bucket's max value.
 *
 * Format: { min, max, normalized, inclusive }
 * - Scores > min and < max will be set to normalized (exclusive boundaries)
 * - Special case: { min: null } means score < max
 * - Special case: { max: Infinity, min: value } means score > min
 *
 * CUSTOMIZE THESE to adjust how final scores are distributed.
 * Default behavior rounds scores into discrete buckets (30, 40, 50, etc.)
 *
 * Note: Boundary values (10, 20, 30, etc.) and scores in [90-100] are NOT normalized
 * in the original logic - they keep their original scores.
 */
export const SCORE_NORMALIZATION_BUCKETS = [
  { min: null, max: 10, normalized: 30 }, // score < 10 → 30
  { min: 10, max: 20, normalized: 30 }, // 10 < score < 20 → 30
  { min: 20, max: 30, normalized: 30 }, // 20 < score < 30 → 30
  { min: 30, max: 40, normalized: 40 }, // 30 < score < 40 → 40
  { min: 40, max: 50, normalized: 50 }, // 40 < score < 50 → 50
  { min: 50, max: 60, normalized: 60 }, // 50 < score < 60 → 60
  { min: 60, max: 70, normalized: 70 }, // 60 < score < 70 → 70
  { min: 70, max: 80, normalized: 80 }, // 70 < score < 80 → 80
  { min: 80, max: 90, normalized: 90 }, // 80 < score < 90 → 90
  { min: 100, max: Infinity, normalized: 100 }, // score > 100 → 100
];

// ====================================================================
// ANALYSIS THRESHOLDS
// ====================================================================

/**
 * SCORE_THRESHOLDS
 * Score thresholds used for statistical analysis and reporting.
 * The system counts how many accounts exceed each threshold.
 *
 * CUSTOMIZE THIS ARRAY to track different score ranges.
 */
export const SCORE_THRESHOLDS = [10, 20, 30, 50, 75, 100, 125, 150, 175, 200];

// ====================================================================
// CSV PARSING OPTIONS
// ====================================================================

/**
 * CSV_PARSE_OPTIONS
 * Configuration options for CSV file parsing.
 * These options are passed to the csv-parse library.
 */
export const CSV_PARSE_OPTIONS = {
  /** POAP CSV parsing configuration */
  POAP: {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  },

  /** DeepDAO CSV parsing configuration */
  DEEPDAO: {
    columns: true,
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  },

  /** Contract Deployment CSV parsing configuration */
  DEPLOYMENT: {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  },
};

// ====================================================================
// CSV COLUMN NAMES
// ====================================================================

/**
 * CSV_COLUMNS
 * The expected column names in each CSV file type.
 * Change these if your CSV files use different column headers.
 */
export const CSV_COLUMNS = {
  /** POAP CSV columns */
  POAP: {
    /** Column containing the Ethereum address */
    COLLECTION: '"Collection"',
  },

  /** DeepDAO CSV columns */
  DEEPDAO: {
    /** Column containing the Ethereum address */
    ADDRESS: "address",
    /** Column containing the number of DAOs participated in */
    NUMBER_OF_DAOS: "number_of_daos",
  },

  /** Contract Deployment CSV columns */
  DEPLOYMENT: {
    /** Column containing the deployer address */
    CODER: "coder",
    /** Column containing the unique contract count */
    UNIQUE_CONTRACT: "unique_contract",
  },
};

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

/**
 * Get the full path to a CSV source file
 * @param filename - The name of the CSV file
 * @returns The full path relative to the script directory
 */
export function getCSVPath(filename: string): string {
  return CSV_SOURCE_DIRECTORY + filename;
}

/**
 * Get the full path to an output file
 * @param outputType - The type of output file (key from OUTPUT_FILES)
 * @returns The full path for the output file
 */
export function getOutputPath(outputType: keyof typeof OUTPUT_FILES): string {
  return OUTPUT_DIRECTORY + OUTPUT_FILES[outputType];
}
