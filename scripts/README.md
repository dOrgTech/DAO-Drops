# DAO Drops - Account Scoring System

## Introduction

This flexible and configurable TypeScript application uses public data to generate activity-based scores for Ethereum accounts as part of the DAO Drops project, capable of producing both overall and dataset-specific scores by analyzing on-chain and off-chain data to identify engaged ecosystem participants for targeted airdrops, governance participation tracking, or community analytics.

## Account Scoring Logic

Allocation power is determined using a script that assigns points to every qualified address based on on-chain activity. In this version, the allocators are comprised of these three sets of addresses:

1. **Galaxy.eco's Shadowy Super Coder list** - Any addresses that deployed at least 3 contracts on Ethereum mainnet before 2023, and deployed contracts that had at least 2 different addresses interacted with.

2. **POAPs** - Attendance at past DevCons, ETHCC, ETH Paris, ETH Denver, ETH Berlin, ETH Boston, ETH Waterloo, EDCON, ETH CapeTown, ETH India, and Dappcon.

3. **DeepDAO's data set** - Top 1,000 participants in DAOs by participation score and top 10,000 by number of DAOs participated in.

---

## 📖 Table of Contents

- [Introduction](#introduction)
- [Account Scoring Logic](#account-scoring-logic)
- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Folder Structure](#folder-structure)
- [How It Works](#how-it-works)
- [Configuration & Customization](#configuration--customization)
- [Running the Scripts](#running-the-scripts)
- [Output Format](#output-format)
- [Forking & Deployment](#forking--deployment)
- [Technical Details](#technical-details)

---

## Overview

The **DAO Drops Account Scoring System** evaluates Ethereum addresses based on three key data sources:

1. **POAP (Proof of Attendance Protocol)** - Event attendance at conferences, hackathons, and community gatherings
2. **DeepDAO** - DAO participation and governance activity
3. **Contract Deployments** - Smart contract deployment activity (builder/developer engagement)

Each data source can be used independently or combined for comprehensive scoring. The system is designed to be easily forkable and customizable through a centralized configuration file.

### Use Cases

- **Targeted Airdrops**: Identify genuinely engaged users for token distributions
- **Community Analytics**: Understand participation patterns across events and DAOs
- **Governance Tokens**: Allocate voting power based on ecosystem engagement
- **Builder Identification**: Find active developers deploying contracts
- **Research**: Analyze Ethereum ecosystem participation trends

---

## Features

✅ **Multi-Source Scoring**: Combine POAP, DeepDAO, and deployment data  
✅ **Flexible Configuration**: All settings centralized in `scripts/config.ts`  
✅ **Modular Architecture**: Run scoring for individual data sources or combined  
✅ **Score Normalization**: Bucket scores into discrete tiers for fair distribution  
✅ **TypeScript**: Full type safety and modern development experience  
✅ **Easy to Fork**: Well-documented, customizable, and production-ready  
✅ **JSON Output**: Clean, standardized score sheet format  
✅ **Statistical Analysis**: Built-in threshold analysis and reporting

---

## Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Fork & Clone the repository**

   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/DAO-Drops.git
   cd DAO-Drops/scripts
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Run a scoring script**

   ```bash
   # Full combined scoring (all data sources)
   npm run start:full

   # Individual data sources
   npm run start:poap
   npm run start:deepdao
   npm run start:deployments
   ```

### Verify Output

Check the `scoreSheets/` directory for generated JSON files:

```bash
ls scoreSheets/
# Output:
# ScoreSheet.json (full scoring)
# ScoreSheetPOAP.json (POAP only)
# ScoreSheetDeepDAO.json (DeepDAO only)
# ScoreSheetDeployment.json (Deployments only)
```

---

## Folder Structure

```
scripts/
├── scripts/                      # Source code (TypeScript)
│   ├── config.ts                 # ⚙️ MAIN CONFIGURATION FILE
│   ├── dataMinerFull.ts          # Combined scoring script
│   ├── dataMinerPOAP.ts          # POAP-only scoring
│   ├── dataMinerDeepDAO.ts       # DeepDAO-only scoring
│   ├── dataMinerDeployments.ts   # Deployment-only scoring
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── csv_src/                  # 📁 CSV data files
│       ├── ContractDeployer.csv
│       ├── DeepDAO.csv
│       ├── DeepDAO1.csv
│       ├── DevCon1.csv
│       ├── ETHDenver1.csv
│       └── ... (POAP event CSVs)
│
├── dist/                         # Compiled JavaScript output
├── scoreSheets/                  # 📊 Generated score sheets (JSON)
│   ├── ScoreSheet.json
│   ├── ScoreSheetPOAP.json
│   ├── ScoreSheetDeepDAO.json
│   └── ScoreSheetDeployment.json
│
├── package.json                  # Node.js dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

### Key Files

| File/Folder              | Purpose                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| `scripts/config.ts`      | **All customizable settings** - modify this to customize behavior |
| `scripts/csv_src/`       | CSV data files for POAP, DeepDAO, and deployments                 |
| `scripts/types/index.ts` | TypeScript interfaces for type safety                             |
| `scoreSheets/`           | Output directory for generated JSON score sheets                  |
| `package.json`           | NPM scripts and dependencies                                      |

---

## How It Works

### Scoring Pipeline

Each scoring script follows this general pipeline:

```
CSV Files → Parse → Process → Score → Normalize → Export JSON
```

### Scoring Logic by Data Source

#### 1. POAP Scoring (`dataMinerPOAP.ts`)

- **Input**: CSV files for Ethereum events (DevCon, ETHDenver, ETHBerlin, etc.)
- **Logic**: Count unique events attended per address
- **Score**: `events_attended × POAP_SCORE_PER_EVENT`
- **Configurable**: Points per event (default: 10)

**Example**:

```
Address: 0x123...
Events attended: 5 (DevCon1, ETHDenver, ETHBerlin, etc.)
Score: 5 × 10 = 50
```

#### 2. DeepDAO Scoring (`dataMinerDeepDAO.ts`)

- **Input**: DeepDAO CSV files with DAO participation data
- **Logic**: Sum the number of DAOs each address participates in
- **Score**: `number_of_daos` (direct value from CSV)

**Example**:

```
Address: 0x123...
DAOs participated: 12
Score: 12
```

#### 3. Contract Deployment Scoring (`dataMinerDeployments.ts`)

- **Input**: Contract deployer CSV with deployment counts
- **Logic**: Count unique contracts deployed per address
- **Score**: `unique_contracts` (direct value from CSV, no multiplier)

**Example**:

```
Address: 0x123...
Contracts deployed: 8
Score: 8
```

#### 4. Full Combined Scoring (`dataMinerFull.ts`)

The most comprehensive scoring combines all three data sources with special logic:

**Step 1: Contract Deployments (Base Score)**

- Start with deployment data
- Filter: Only include addresses with ≥ `MINIMUM_DEPLOYMENTS_THRESHOLD` (default: 3)
- Score: `deployment_count × CONTRACT_DEPLOYMENT_MULTIPLIER` (default: 10x)

**Step 2: Add DeepDAO Data**

- Add DAO participation count to existing scores
- Score: `+number_of_daos`

**Step 3: Add POAP Data**

- Count unique events per address
- Score: `+event_count × POAP_SCORE_PER_EVENT`

**Step 4: Score Normalization**

- Apply bucketing based on `SCORE_NORMALIZATION_BUCKETS`
- Round scores into discrete tiers (30, 40, 50, 60, etc.)
- Special handling for scores 90-100 and exact boundary values

**Example**:

```
Address: 0x123...

Deployments: 5 contracts × 10 = 50 points
DeepDAO: 8 DAOs = +8 points
POAPs: 3 events × 10 = +30 points
Raw Score: 88

After normalization (80 < score < 90 → 90):
Final Score: 90
```

### Statistical Analysis

All scripts include threshold analysis:

- Counts addresses exceeding each threshold (10, 20, 30, 50, 75, 100, etc.)
- Reports total addresses processed
- Shows score distribution

---

## Configuration & Customization

### The Configuration File

**All customizable settings** are centralized in:

📄 **`scripts/config.ts`**

This design makes forking and customization straightforward—you modify settings in one place without touching the core logic.

### What You Can Customize

#### 1. **Data Sources**

**Add/Remove POAP Events:**

```typescript
export const POAP_EVENT_FILES = [
  "DevCon1.csv",
  "DevCon2.csv",
  "ETHDenver1.csv",
  // Add your custom event files here
  "MyCustomEvent.csv",
];
```

**To add a new POAP event:**

1. Place CSV file in `scripts/csv_src/`
2. Add filename to `POAP_EVENT_FILES` array
3. Ensure CSV has a `"Collection"` column with Ethereum addresses

**Change DeepDAO Files:**

```typescript
export const DEEPDAO_FILES = {
  TRANSACTIONS: "DeepDAO.csv",
  PARTICIPATION: "DeepDAO1.csv",
};
```

**Change Deployment Files:**

```typescript
export const DEPLOYMENT_FILES = {
  CONTRACT_DEPLOYER: "ContractDeployer.csv",
};
```

#### 2. **Scoring Parameters**

**POAP Points Per Event:**

```typescript
export const POAP_SCORE_PER_EVENT = 10; // Default: 10
// Increase to 20 to give events more weight
```

**Contract Deployment Multiplier (Full Scoring Only):**

```typescript
export const CONTRACT_DEPLOYMENT_MULTIPLIER = 10; // Default: 10x
// Reduce to 5 to lower deployment impact
```

**Minimum Deployments Threshold (Full Scoring Only):**

```typescript
export const MINIMUM_DEPLOYMENTS_THRESHOLD = 3; // Default: 3
// Increase to 10 to only include active deployers
```

#### 3. **Score Normalization (Full Scoring Only)**

Control how final scores are bucketed:

```typescript
export const SCORE_NORMALIZATION_BUCKETS = [
  { min: null, max: 10, normalized: 30 }, // score < 10 → 30
  { min: 10, max: 20, normalized: 30 }, // 10 < score < 20 → 30
  { min: 20, max: 30, normalized: 30 }, // 20 < score < 30 → 30
  { min: 30, max: 40, normalized: 40 }, // 30 < score < 40 → 40
  // ... customize as needed
  { min: 100, max: Infinity, normalized: 100 }, // score > 100 → 100
];
```

**How it works:**

- Scores between `min` and `max` (exclusive) → set to `normalized`
- Exact boundary values (10, 20, 30, etc.) keep original score
- Scores in 90-100 range keep original score
- Creates discrete tiers for fairer distribution

#### 4. **Output Configuration**

**Output Directory:**

```typescript
export const OUTPUT_DIRECTORY = "./scoreSheets/";
```

**Output File Names:**

```typescript
export const OUTPUT_FILES = {
  FULL_SCORE: "ScoreSheet.json",
  POAP_SCORE: "ScoreSheetPOAP.json",
  DEEPDAO_SCORE: "ScoreSheetDeepDAO.json",
  DEPLOYMENT_SCORE: "ScoreSheetDeployment.json",
};
```

#### 5. **Analysis Thresholds**

Customize which score ranges to track:

```typescript
export const SCORE_THRESHOLDS = [10, 20, 30, 50, 75, 100, 125, 150, 175, 200];
// Add more granular thresholds: [5, 10, 15, 20, 25, ...]
```

#### 6. **CSV Column Names**

If your CSV files use different headers:

```typescript
export const CSV_COLUMNS = {
  POAP: {
    COLLECTION: '"Collection"', // Your POAP address column
  },
  DEEPDAO: {
    ADDRESS: "address",
    NUMBER_OF_DAOS: "number_of_daos",
  },
  DEPLOYMENT: {
    CODER: "coder",
    UNIQUE_CONTRACT: "unique_contract",
  },
};
```

#### 7. **CSV Parsing Options**

Customize CSV parsing behavior:

```typescript
export const CSV_PARSE_OPTIONS = {
  POAP: {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  },
  // Similar for DEEPDAO and DEPLOYMENT
};
```

### Configuration Examples

**Example 1: Double POAP Event Value**

```typescript
export const POAP_SCORE_PER_EVENT = 20; // Changed from 10
```

**Example 2: Stricter Deployment Filter**

```typescript
export const MINIMUM_DEPLOYMENTS_THRESHOLD = 10; // Changed from 3
```

**Example 3: Custom Score Tiers**

```typescript
export const SCORE_NORMALIZATION_BUCKETS = [
  { min: null, max: 25, normalized: 25 },
  { min: 25, max: 50, normalized: 50 },
  { min: 50, max: 75, normalized: 75 },
  { min: 75, max: Infinity, normalized: 100 },
];
```

---

## Running the Scripts

### Available NPM Scripts

```bash
# Build TypeScript to JavaScript
npm run build

# Run individual scoring scripts (with ts-node, no build needed)
npm run start:full         # Combined scoring (all data sources)
npm run start:poap         # POAP events only
npm run start:deepdao      # DeepDAO only
npm run start:deployments  # Contract deployments only
```

### Running Compiled JavaScript (Production)

After building with `npm run build`, you can run the compiled scripts:

```bash
node dist/dataMinerFull.js
node dist/dataMinerPOAP.js
node dist/dataMinerDeepDAO.js
node dist/dataMinerDeployments.js
```

### Script Comparison

| Script                    | Data Sources                 | Output File                 | Use Case                         |
| ------------------------- | ---------------------------- | --------------------------- | -------------------------------- |
| `dataMinerFull.ts`        | POAP + DeepDAO + Deployments | `ScoreSheet.json`           | Comprehensive engagement scoring |
| `dataMinerPOAP.ts`        | POAP only                    | `ScoreSheetPOAP.json`       | Event attendance scoring         |
| `dataMinerDeepDAO.ts`     | DeepDAO only                 | `ScoreSheetDeepDAO.json`    | DAO participation scoring        |
| `dataMinerDeployments.ts` | Deployments only             | `ScoreSheetDeployment.json` | Developer/builder scoring        |

---

## Output Format

All scripts generate JSON files in the `scoreSheets/` directory.

### JSON Structure

```json
[
  {
    "account": "0x1234567890abcdef1234567890abcdef12345678",
    "score": 50
  },
  {
    "account": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "score": 75
  }
]
```

### Properties

- **`account`** (string): Ethereum address (42-character hex string with `0x` prefix)
- **`score`** (number): Computed activity score for the address

### Output Files

| File                        | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `ScoreSheet.json`           | Full combined scoring from all data sources     |
| `ScoreSheetPOAP.json`       | Scoring based only on POAP event attendance     |
| `ScoreSheetDeepDAO.json`    | Scoring based only on DeepDAO DAO participation |
| `ScoreSheetDeployment.json` | Scoring based only on contract deployments      |

### Sample Output

```json
[
  {
    "account": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "score": 90
  },
  {
    "account": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "score": 70
  }
]
```

### Console Output

Each script also prints statistics to the console:

```
Total addresses: 1547
Addresses above 10: 1234
Addresses above 20: 987
Addresses above 30: 654
Addresses above 50: 321
Addresses above 75: 123
Addresses above 100: 45
```

---

## Forking & Deployment

### How to Fork This Project

This application is designed to be **easily forkable** for your own use case. Here's how:

#### Step 1: Fork & Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/DAO-Drops.git
cd DAO-Drops/scripts
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Replace CSV Data Files

Replace the CSV files in `scripts/csv_src/` with your own data:

**POAP Files**: One CSV per event with a `"Collection"` column

```csv
"Collection"
"0x1234567890abcdef..."
"0xabcdef123456..."
```

**DeepDAO Files**: CSV with `address` and `number_of_daos` columns

```csv
address,number_of_daos
0x1234567890abcdef...,5
0xabcdef123456...,12
```

**Deployment Files**: CSV with `coder` and `unique_contract` columns

```csv
coder,unique_contract
0x1234567890abcdef...,3
0xabcdef123456...,7
```

#### Step 4: Customize Configuration

Edit `scripts/config.ts` to match your needs:

```typescript
// Example customizations
export const POAP_SCORE_PER_EVENT = 20; // Double the points
export const MINIMUM_DEPLOYMENTS_THRESHOLD = 5; // Stricter filter
export const POAP_EVENT_FILES = [...POAP_EVENT_FILES, "MyCustomEvent.csv"];
```

#### Step 5: Build and Test

```bash
# Build the project
npm run build

# Test with one script
npm run start:poap

# Verify output
cat scoreSheets/ScoreSheetPOAP.json
```

#### Step 6: Run All Scripts

```bash
npm run start:full
npm run start:poap
npm run start:deepdao
npm run start:deployments
```

### Deployment Checklist

✅ CSV files placed in `scripts/csv_src/`  
✅ CSV column names match `CSV_COLUMNS` in `config.ts`  
✅ `POAP_EVENT_FILES` updated with your event files  
✅ Scoring parameters customized (`POAP_SCORE_PER_EVENT`, etc.)  
✅ Output directory exists (`scoreSheets/`)  
✅ Dependencies installed (`npm install`)  
✅ Project builds successfully (`npm run build`)  
✅ Scripts run without errors  
✅ Output JSON files generated correctly

### Integration Examples

**Smart Contract Integration:**

```solidity
// Read score sheet off-chain, create Merkle tree
// Use for airdrop eligibility
function claimAirdrop(address user, uint256 score, bytes32[] calldata proof) {
    require(score >= MIN_SCORE, "Score too low");
    require(MerkleProof.verify(proof, merkleRoot, keccak256(abi.encodePacked(user, score))));
    // ... airdrop logic
}
```

**Backend API Integration:**

```javascript
// Express.js example
const scores = require("./scoreSheets/ScoreSheet.json");

app.get("/api/score/:address", (req, res) => {
  const address = req.params.address.toLowerCase();
  const user = scores.find((s) => s.account.toLowerCase() === address);
  res.json({ score: user?.score || 0 });
});
```

---

## Technical Details

### Technology Stack

- **TypeScript** 5.9.3
- **Node.js** (v14+)
- **csv-parse** 6.1.0 - CSV parsing library
- **ts-node** 10.9.2 - TypeScript execution

### Type Definitions

All types are defined in `scripts/types/index.ts`:

```typescript
// Core account object
interface AccountObject {
  account: string;
  score: number;
}

// CSV record types
interface POAPRecord {
  '"Collection"': string;
}

interface DeepDAORecord {
  address: string;
  number_of_daos: string;
}

interface DeployerRecord {
  coder: string;
  unique_contract: string;
}
```

### CSV Parsing

The system uses `csv-parse` with configurable options for each data source:

```typescript
import { parse } from "csv-parse/sync";

const records = parse(fileContent, {
  columns: true,
  delimiter: ",",
  ltrim: true,
  rtrim: true,
});
```

### Score Calculation Flow

**POAP Script:**

```
Read CSV files → Parse → Count events per address → Multiply by points → Export
```

**DeepDAO Script:**

```
Read CSV files → Parse → Sum DAOs per address → Export
```

**Deployments Script:**

```
Read CSV → Parse → Extract deployment counts → Export
```

**Full Script:**

```
Read deployments → Filter by threshold → Multiply count
  ↓
Add DeepDAO scores
  ↓
Add POAP scores
  ↓
Normalize into buckets
  ↓
Export JSON
```

### Performance Considerations

- **Memory**: All CSV files loaded into memory. For very large datasets (>1M rows), consider streaming.
- **Processing**: Single-threaded. For massive datasets, consider parallel processing.
- **I/O**: File reads are synchronous. For production, consider async I/O.

### Data Integrity

- **Address Validation**: No validation performed. Ensure CSVs contain valid Ethereum addresses.
- **Deduplication**: Addresses are deduplicated automatically using Map objects.
- **Case Sensitivity**: Addresses are case-sensitive in output. Consider normalizing to checksummed format.

### Extending the System

**Add a New Data Source:**

1. Create type definition in `scripts/types/index.ts`
2. Add CSV parsing logic in a new script
3. Add configuration in `scripts/config.ts`
4. Update this README with the new data source

**Add Custom Scoring Logic:**

```typescript
// In dataMinerFull.ts or create a new script
const customScore = (account: string): number => {
  // Your custom logic
  return score;
};
```
