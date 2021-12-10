# DAO Drops account scoring script

This account scoring script uses public data to generate activity based scores for Ethereum
accounts for use in the DAO Drops project. This set of scripts can generate an overall score as
well as a score based on each individual data set used. The scoring scripts and data sets can
be found in the scripts folder.The data sets are in the csv_src folder found within the scripts
folder. Each of the generated score sheets can be found in scoreSheets folder.

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
