# DAO-Drops

Full stack MERN app for the DAO Drops Project

React based front end code can be found in the client folder.

Front end is hosted on Netlify

Express and mongoDB code can be found in the server folder.

Express middleware is hosted on Heroku while the database is hosted on
MongoDB's Atlas

The scoring scripts and the data sets used for scoring can be found in the
scripts folder.

## DAO Drops account scoring script

This account scoring script uses public data to generate activity based scores
for Ethereum accounts for use in the DAO Drops project. This set of scripts can
generate an overall score as well as a score based on each individual data set
used. The scoring scripts and data sets can be found in the scripts folder.
The data sets are in the csv_src folder found within the scripts
folder.
Each of the generated score sheets can be found in scoreSheets folder.

## DAO Drops account scoring logic

Allocation power is determined using a script that assigns points to every
qualified address based on on-chain activity. For Drop 1, the allocators are
comprised of these three sets of addresses:

1. Galaxy.eco’s Shadowy Super Coder list. That is comprised of 110,294 Ethereum
   addresses who have deployed at least 1 contract on Ethereum mainnet before
   August 1st, 2021, and deployed contracts that had at least 2 different
   addresses interacted.
2. POAPs for all past DevCon’s, ETHCC, ETH Paris, and ETH Denver.
3. DeepDAO’s data set of participants in DAOs.

Score Normalization Code logic: For the Contracts Deployers and DeepDAO Data,
we added an if based logic block that rounds up an accounts score to the
nearest ten up to 100. It then rounds everything over 100 down to 100 (there
were few outliers that high). The POAP data was adjusted to one POAP == 10
points.
