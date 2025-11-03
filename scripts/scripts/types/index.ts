/**
 * ====================================================================
 * TYPE DEFINITIONS FOR DAO DROPS SCORING SYSTEM
 * ====================================================================
 *
 * This file contains all TypeScript type definitions and interfaces
 * used throughout the DAO Drops scoring system.
 *
 * These types ensure type safety and provide clear structure for
 * data flowing through the scoring pipeline.
 */

// ====================================================================
// CORE ACCOUNT TYPES
// ====================================================================

/**
 * AccountObject
 * The primary data structure for scored accounts.
 *
 * This interface represents an Ethereum account with its computed activity score.
 * All scoring scripts generate arrays of AccountObject that get exported to JSON.
 *
 * @property account - The Ethereum address (e.g., "0x1234...")
 * @property score - The computed activity score for this account
 *
 * CUSTOMIZATION:
 * - If you want to track additional metrics per account, add new properties here
 * - Make sure to update the scoring scripts to populate any new fields
 */
export interface AccountObject {
  account: string;
  score: number;
}

// ====================================================================
// CSV DATA SOURCE TYPES
// ====================================================================

/**
 * DeepDAORecord
 * Type definition for DeepDAO CSV file entries.
 *
 * DeepDAO provides data about DAO participation across the ecosystem.
 * Each record represents an account's involvement in DAOs.
 *
 * @property address - The Ethereum address of the DAO participant
 * @property number_of_daos - Number of DAOs this address has participated in (as string from CSV)
 *
 * CUSTOMIZATION:
 * - If your DeepDAO CSV has different columns, update this interface
 * - Also update CSV_COLUMNS.DEEPDAO in config.ts to match your CSV structure
 */
export interface DeepDAORecord {
  address: string;
  number_of_daos: string;
}

/**
 * DeployerRecord
 * Type definition for contract deployment CSV file entries.
 *
 * Tracks Ethereum accounts that have deployed smart contracts.
 * This data helps identify builders and developers in the ecosystem.
 *
 * @property coder - The Ethereum address of the contract deployer
 * @property unique_contract - Number of unique contracts deployed (as string from CSV)
 *
 * CUSTOMIZATION:
 * - If your deployment CSV has different columns, update this interface
 * - Also update CSV_COLUMNS.DEPLOYMENT in config.ts to match your CSV structure
 */
export interface DeployerRecord {
  coder: string;
  unique_contract: string;
}

/**
 * POAPRecord
 * Type definition for POAP (Proof of Attendance Protocol) CSV file entries.
 *
 * POAP tracks attendance at Ethereum events, conferences, and hackathons.
 * Each record represents one person attending one event.
 *
 * @property '"Collection"' - The Ethereum address of the POAP collector
 *                            Note: The property name includes literal quotes due to CSV format
 *
 * CUSTOMIZATION:
 * - If your POAP CSV uses a different column name, update this interface
 * - Also update CSV_COLUMNS.POAP in config.ts to match your CSV structure
 * - The quotes in the property name are intentional - they match the CSV header
 */
export interface POAPRecord {
  '"Collection"': string;
}

// ====================================================================
// STATISTICS & ANALYTICS TYPES
// ====================================================================

/**
 * StatisticsData
 * Type definition for aggregated statistics about scored accounts.
 *
 * This interface can be used to track and report scoring statistics.
 * While not currently used in the main scripts, it's provided for
 * anyone who wants to extend the system with analytics features.
 *
 * @property numberOfAccounts - Total count of unique accounts scored
 * @property totalScore - Sum of all account scores
 * @property highestScore - The highest individual account score
 * @property averageScore - Mean score across all accounts
 * @property medianScore - Median score across all accounts
 *
 * CUSTOMIZATION:
 * - Add additional statistical metrics as needed (e.g., standardDeviation, percentiles)
 * - Use this interface to structure statistics reporting in your custom scripts
 */
export interface StatisticsData {
  numberOfAccounts: number;
  totalScore: number;
  highestScore: number;
  averageScore: number;
  medianScore: number;
}
