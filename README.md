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

1. Galaxy.eco’s Shadowy Super Coder list for any addresses that deployed at least 3 contracts on Ethereum mainnet before
   2023, and deployed contracts that had at least 2 different addresses interacted
2. POAPs for past DevCons, ETHCC, ETH Paris, ETH Denver, ETH Berlin, ETH Boston, ETH Waterloo, EDCON, ETH CapeTown, ETH India, and Dappcon.
3. DeepDAO’s data set of top 1,000 participants in DAOs by participation score and top 10,000 by number of DAOs participated in.
