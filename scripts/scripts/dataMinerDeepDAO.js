const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const median = (arr) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

async function main() {
  console.log("dataminer DeepDAO only starting");
  let accounts = [];
  let overAllScore = 0;
  let scores = [];
  let deepDAONumberOfAccounts = 0;
  let totalScoreDeepDAO = 0;
  let highestDeepDAOscore = 0;
  let numberOfAccountsAbove10 = 0;
  let numberOfAccountsAbove20 = 0;
  let numberOfAccountsAbove30 = 0;
  let numberOfAccountsAbove50 = 0;
  let numberOfAccountsAbove75 = 0;
  let numberOfAccountsAbove100 = 0;
  let numberOfAccountsAbove125 = 0;
  let numberOfAccountsAbove150 = 0;
  let numberOfAccountsAbove175 = 0;
  let numberOfAccountsAbove200 = 0;

  let numberDouplicate = 0;

  ///////////////////////////DeepDAO Score parser code///////////////
  console.log("Parsing DeepDAO data");

  const deepDAOFileContent = await fs.readFileSync(
    __dirname + "/csv_src/DeepDAO.csv"
  );

  console.log("Parsing contract deployment data");
  const deepDAOScores = await parse(deepDAOFileContent, {
    columns: true,
    // quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  // get json entries length
  recordLength = deepDAOScores.length;
  // loop the json entries
  for (let i = 0; i < recordLength; i++) {
    // get the address of each deployer
    let deployerAccount = deepDAOScores[i]["address"];
    // get the number of contracts trhat account has deployed
    let deploymentCount = deepDAOScores[i]["number_of_daos"];
    //create object for it
    let accountObject = {
      account: deployerAccount,
      score: parseInt(deploymentCount),
    };
    //push object to accounst array
    accounts.push(accountObject);
    //push score into scores array
    scores.push(parseInt(deploymentCount));
    //add its score to the current overall score
    overAllScore += parseInt(deploymentCount);
    //track overall data for scoring adjustments
    deepDAONumberOfAccounts = recordLength;
    totalScoreDeepDAO += parseInt(deploymentCount);
    if (highestDeepDAOscore < parseInt(deploymentCount)) {
      highestDeepDAOscore = parseInt(deploymentCount);
    }

    if (deploymentCount >= 10) {
      numberOfAccountsAbove10++;
    }
    if (deploymentCount >= 20) {
      numberOfAccountsAbove20++;
    }
    if (deploymentCount >= 30) {
      numberOfAccountsAbove30++;
    }
    if (deploymentCount >= 50) {
      numberOfAccountsAbove50++;
    }
    if (deploymentCount >= 75) {
      numberOfAccountsAbove75++;
    }
    if (deploymentCount >= 100) {
      numberOfAccountsAbove100++;
    }
    if (deploymentCount >= 125) {
      numberOfAccountsAbove125++;
    }
    if (deploymentCount >= 150) {
      numberOfAccountsAbove150++;
    }
    if (deploymentCount >= 175) {
      numberOfAccountsAbove175++;
    }
    if (deploymentCount >= 200) {
      numberOfAccountsAbove200++;
    }
  }

  ///////////////////////////DeepDAO Score parser code///////////////
  console.log("Parsing DeepDAO data");

  const deepDAOFileContent1 = await fs.readFileSync(
    __dirname + "/csv_src/DeepDAO1.csv"
  );

  console.log("Parsing contract deployment data");
  const deepDAOScores1 = await parse(deepDAOFileContent1, {
    columns: true,
    // quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  // get json entries length
  recordLength = deepDAOScores1.length;

  let deepDAOScoresArray = [];

  // loop the json entries
  for (let i = 0; i < recordLength; i++) {
    // get the address of each deployer
    let deployerAccount = deepDAOScores1[i]["address"];
    // get the number of contracts trhat account has deployed
    let deploymentCount = deepDAOScores1[i]["number_of_daos"];
    //check if account is in the accounts array already
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === deployerAccount
    );
    //if the account isnt in the accounts array
    if (existingAccount === undefined) {
      //create object for it
      let accountObject = {
        account: deployerAccount,
        score: parseInt(deploymentCount),
      };
      //push object to accounst array
      accounts.push(accountObject);
      //push score into scores array
      scores.push(parseInt(deploymentCount));
      // push score into deepDAOScoresArray array
      deepDAOScoresArray.push(parseInt(deploymentCount));

      //add its score to the current overall score
      overAllScore += parseInt(deploymentCount);
      //track overall data for scoring adjustments
      deepDAONumberOfAccounts = recordLength;
      totalScoreDeepDAO += parseInt(deploymentCount);
      if (highestDeepDAOscore < parseInt(deploymentCount)) {
        highestDeepDAOscore = parseInt(deploymentCount);
      }
      if (deploymentCount >= 10) {
        numberOfAccountsAbove10++;
      }
      if (deploymentCount >= 20) {
        numberOfAccountsAbove20++;
      }
      if (deploymentCount >= 30) {
        numberOfAccountsAbove30++;
      }
      if (deploymentCount >= 50) {
        numberOfAccountsAbove50++;
      }
      if (deploymentCount >= 75) {
        numberOfAccountsAbove75++;
      }
      if (deploymentCount >= 100) {
        numberOfAccountsAbove100++;
      }
      if (deploymentCount >= 125) {
        numberOfAccountsAbove125++;
      }
      if (deploymentCount >= 150) {
        numberOfAccountsAbove150++;
      }
      if (deploymentCount >= 175) {
        numberOfAccountsAbove175++;
      }
      if (deploymentCount >= 200) {
        numberOfAccountsAbove200++;
      }
    } else {
      //if address already exists from other data set skip adding it
      numberDouplicate++;
    }
  }
  /////////////////////////jsonifier and file system saverizor code///////////////////////////
  console.log("JSONifying data");
  var jsonData = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(
    "./scoreSheets/ScoreSheetDeepDAO.json",
    jsonData,
    function (err) {
      res.json({ success: true });
    }
  );
  console.log("Data JSONified into ScoreSheet.json!!!");
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

  let n175 = numberOfAccountsAbove175 - numberOfAccountsAbove200;
  let n150 = numberOfAccountsAbove150 - n175;
  let n125 = numberOfAccountsAbove125 - n150;
  let n100 = numberOfAccountsAbove100 - n125;
  let n75 = numberOfAccountsAbove75 - n100;
  let n50 = numberOfAccountsAbove50 - n75;
  let n30 = numberOfAccountsAbove30 - n50;
  let n20 = numberOfAccountsAbove20 - n30;
  let n10 = numberOfAccountsAbove10 - n20;
  let totalAbove10 =
    n10 +
    n20 +
    n30 +
    n50 +
    n75 +
    n100 +
    n125 +
    n150 +
    n175 +
    numberOfAccountsAbove200;

  console.log(
    "The number of accounts with a score above 10 but less than 20: "
  );
  console.log(n10);
  console.log(
    "The number of accounts with a score above 20 but less than 30: "
  );
  console.log(n20);
  console.log(
    "The number of accounts with a score above 30 but less than 50: "
  );
  console.log(n30);
  console.log(
    "The number of accounts with a score above 50 but less than 75: "
  );
  console.log(n50);
  console.log(
    "The number of accounts with a score above 75 but less than 100: "
  );
  console.log(n75);
  console.log(
    "The number of accounts with a score above 100 but less than 125: "
  );
  console.log(n100);
  console.log(
    "The number of accounts with a score above 125 but less than 150: "
  );
  console.log(n125);
  console.log(
    "The number of accounts with a score above 150 but less than 175: "
  );
  console.log(n150);
  console.log(
    "The number of accounts with a score above 175 but less than 200: "
  );
  console.log(n175);
  console.log("The number of accounts with a score above 200: ");
  console.log(numberOfAccountsAbove200);
  console.log("The number of accounts with a score above 10: ");
  console.log(totalAbove10);
  console.log("The total number of accounts with a score less than 10: ");
  console.log(deepDAONumberOfAccounts - totalAbove10);
  console.log(
    "The amount of dublicated data inside the Deep DAO Participation data:"
  );
  console.log(numberDouplicate);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
