# DAO Drops account scoring script

This account scoring script uses public data to generate activity based scores for Ethereum
accounts for use in the DAO Drops project. This set of scripts can generate an overall score as
well as a score based on each individual data set used. The scoring scripts and data sets can
be found in the scripts folder.The data sets are in the csv_src folder found within the scripts
folder. Each of the generated score sheets can be found in scoreSheets folder.

## DAO Drops account scoring logic 

Allocation power is determined using a script that assigns points to every qualified address based on on-chain activity. For Drop 1, the allocators are comprised of these three sets of addresses:

1. Galaxy.eco’s Shadowy Super Coder list. That is comprised of 110,294 Ethereum addresses who have deployed at least 1 contract on Ethereum mainnet before August 1st, 2021, and deployed contracts that had at least 2 different addresses interacted.
2. POAPs for all past DevCon’s, ETHCC, ETH Paris, and ETH Denver.
3. DeepDAO’s data set of participants in DAOs.

Score Normalization Code logic: For the Contracts Deployers and DeepDAO Data, we added an if based logic block that rounds up an accounts score to the nearest ten up to 100. It then rounds everything over 100 down to 100 (there were few outliers that high). The POAP data was adjusted to one POAP == 10 points.

## Commands to run each script:

To generate a scoring sheet using all of the data sets run
`node scripts/dataMinerFull.js`
inside the main directory for this project. The score sheet generated will be named
ScoreSheet.json

To generate a scoring sheet using just the Contract Deployment data set run
`node scripts/dataMinerDeployments.js`
inside the main directory for this project. The score sheet generated will be named
ScoreSheetDeployment.json

To generate a scoring sheet using just the DeepDAO data set run
`node scripts/dataMinerDeepDAO.js`
inside the main directory for this project. The score sheet generated will be named
ScoreSheetDeepDAO.json

To generate a scoring sheet using just the POAP data set run
`node scripts/dataMinerPOAP.js`
inside the main directory for this project. The score sheet generated will be named
ScoreSheetPOAP.json

### Scoring sheets are in JSON format
