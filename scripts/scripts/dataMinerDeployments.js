const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

async function main() {
  console.log("dataminer Contract Deployments only starting");
  let accounts = [];
  let overAllScore = 0;
  let scores = [];
  let contractDeployerNumberOfAccounts = 0;
  let totalScoreContractDeployer = 0;
  let highestContractDeployerScore = 0;
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

  ///////////////////////////blockchain contract deployment parser code///////////////

  const deployerFileContent = await fs.readFileSync(
    __dirname + "/csv_src/ContractDeployer.csv"
  );

  console.log("Parsing contract deployment data");
  const deployerRecords = await parse(deployerFileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true
  });

  // get CSV entries length
  let recordLength = deployerRecords.length;
  // loop the CSV entries
  for (let i = 0; i < recordLength; i++) {
    // get the address of each deployer
    let deployerAccount = deployerRecords[i]["coder"];
    // get the number of contracts trhat account has deployed
    let deploymentCount = deployerRecords[i]["unique_contract"];
    // add ("") around the address
    // deploymentCount = deploymentCount.replace(/"/g, "");
    //create onject for it
    let accountObject = {
      account: deployerAccount,
      score: parseInt(deploymentCount)
    };
    //push new account object to sheet
    accounts.push(accountObject);
    //push score into scores array
    scores.push(parseInt(deploymentCount));
    //add its score to the current overall score
    overAllScore += parseInt(deploymentCount);
    contractDeployerNumberOfAccounts = recordLength;
    totalScoreContractDeployer += parseInt(deploymentCount);
    if (highestContractDeployerScore < parseInt(deploymentCount)) {
      highestContractDeployerScore = parseInt(deploymentCount);
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

  /////////////////////////jsonifier and file system saverizor code///////////////////////////
  console.log("JSONifying data");
  var jsonData = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(
    "./scoreSheets/ScoreSheetDeployment.json",
    jsonData,
    function(err) {
      res.json({ success: true });
    }
  );
  console.log("Data JSONified into ScoreSheet.json!!!");

  console.log(
    "The total number of accounts in the Contract Deployer data is: "
  );
  console.log(contractDeployerNumberOfAccounts);
  console.log("The total score from the Contract Deployer data is: ");
  console.log(totalScoreContractDeployer);
  console.log("The highest score in the Contract Deployer data is: ");
  console.log(highestContractDeployerScore);
  console.log("The average score for the Contract Deployer data is: ");
  console.log(overAllScore / accounts.length);
  console.log("The median score for the Contract Deployer data is: ");
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
  console.log(contractDeployerNumberOfAccounts - totalAbove10);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
