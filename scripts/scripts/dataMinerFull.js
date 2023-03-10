const fs = require("fs");
const parse = require("csv-parse/lib/sync");

let accounts = [];
let scores = [];
let poapScoresArray = [];
let overAllScore = 0;

let contractDeployerNumberOfAccounts = 0;
let totalScoreContractDeployer = 0;
let highestContractDeployerScore = 0;
let averageScoreDeployer = 0;
let medianScoreDeployer = 0;

let deepDAONumberOfAccounts = 0;
let totalScoreDeepDAO = 0;
let highestDeepDAOscore = 0;
let averageScoreDeepDAO = 0;
let medianScoreDeepDAO = 0;

let poapNumberOfAccounts = 0;
let totalScorePOAP = 0;
let highestPOAPscore = 0;
let averageScorePOAP = 0;
let medianScorePOAP = 0;

const median = (arr) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const generalizedPOAPparse = async (fileLocation) => {
  console.log("Parsing " + fileLocation);

  const file = await fs.readFileSync(__dirname + "/csv_src/" + fileLocation);
  const records = parse(file, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      poapNumberOfAccounts++;
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore += 10;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore += 10;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }
  //calculate average score
  averageScorePOAP = totalScorePOAP / poapNumberOfAccounts;
  // calculate median score
  medianScorePOAP = median(poapScoresArray);
};

async function main() {
  console.log("dataminer starting");
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
    rtrim: true,
  });

  let deploymentScores = [];
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

    if (deploymentCount > 3) {
      let accountObject = {
        account: deployerAccount,
        score: parseInt(deploymentCount) * 10,
      };
      //push new account object to sheet
      accounts.push(accountObject);
      //push score into scores array
      scores.push(parseInt(deploymentCount));
      // push score into deploymentScores array
      deploymentScores.push(parseInt(deploymentCount));
      //add its score to the current overall score
      overAllScore += parseInt(deploymentCount);
      contractDeployerNumberOfAccounts = accounts.length;
      totalScoreContractDeployer += parseInt(deploymentCount);
      if (highestContractDeployerScore < parseInt(deploymentCount)) {
        highestContractDeployerScore = parseInt(deploymentCount);
      }
      //calculate average score
      averageScoreDeployer = totalScoreContractDeployer / recordLength;
      // calculate median score
      medianScoreDeployer = median(deploymentScores);
    }
  }

  ///////////////////////////DeepDAO Score parser code///////////////
  console.log("Parsing DeepDAO data");

  const deepDAOFileContent = await fs.readFileSync(
    __dirname + "/csv_src/DeepDAO.csv"
  );

  const deepDAOScores = await parse(deepDAOFileContent, {
    columns: true,
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  let deepDAOScoresArray = [];
  // get json entries length
  recordLength = deepDAOScores.length;
  // loop the json entries
  for (let i = 0; i < recordLength; i++) {
    // get the address of each deployer
    let account = deepDAOScores[i]["address"];
    // get the number of contracts trhat account has deployed
    let count = deepDAOScores[i]["number_of_daos"];

    //check if account is in the accounts array already
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === account
    );
    //if the account isnt in the accounts array
    if (existingAccount === undefined) {
      //create object for it
      let accountObject = {
        account: account,
        score: parseInt(count),
      };
      //push object to accounst array
      accounts.push(accountObject);
    } else {
      //add to existing accounts score to its existing array entry
      existingAccount.score += parseInt(count);
    }

    //push score into scores array
    scores.push(parseInt(count));
    // push score into deepDAOScoresArray array
    deepDAOScoresArray.push(parseInt(count));

    //add its score to the current overall score
    overAllScore += parseInt(count);
    //track overall data for scoring adjustments
    deepDAONumberOfAccounts = recordLength;
    totalScoreDeepDAO += parseInt(count);
    if (highestDeepDAOscore < parseInt(count)) {
      highestDeepDAOscore = parseInt(count);
    }
  }
  //calculate average score
  averageScoreDeepDAO = totalScoreDeepDAO / recordLength;
  // calculate median score
  medianScoreDeepDAO = median(deepDAOScoresArray);

  ////////////////////////Devcon1 Parser///////////////////////////
  await generalizedPOAPparse("DevCon1.csv");
  ////////////////////////Devcon2 Parser///////////////////////////
  await generalizedPOAPparse("DevCon2.csv");
  ////////////////////////Devcon3 Parser///////////////////////////
  await generalizedPOAPparse("DevCon3.csv");
  ////////////////////////Devcon4 Parser///////////////////////////
  await generalizedPOAPparse("DevCon4.csv");
  ////////////////////////Devcon5 Parser///////////////////////////
  await generalizedPOAPparse("DevCon5.csv");
  ////////////////////////ETHBerlin Parser///////////////////////////
  await generalizedPOAPparse("ETHBerlin.csv");
  await generalizedPOAPparse("ETHBerlin2.csv");
  ////////////////////////ETHBoston Parser///////////////////////////
  await generalizedPOAPparse("ETHBOSTON1.csv");
  await generalizedPOAPparse("ETHBOSTON2.csv");
  await generalizedPOAPparse("ETHBOSTON3.csv");
  //////////////////////ETHDenver Parser///////////////////////////
  await generalizedPOAPparse("ETHDenver1.csv");
  await generalizedPOAPparse("ETHDenver2.csv");
  await generalizedPOAPparse("ETHDenver3.csv");
  //////////////////////ETHIndia Parser///////////////////////////
  await generalizedPOAPparse("ETHIndia.csv");
  await generalizedPOAPparse("ETHIndia2.csv");
  await generalizedPOAPparse("ETHIndia3.csv");
  //////////////////////Dappcon 2019 Parser///////////////////////////
  await generalizedPOAPparse("Dappcon_2019.csv");
  //////////////////////Dappcon 2019 Parser///////////////////////////
  await generalizedPOAPparse("DappCon.csv");
  ////////////////////DevCon Bogota Parser///////////////////////////
  await generalizedPOAPparse("Devcon_Bogota.csv");
  //////////////////////EDCON 1 Parser///////////////////////////
  await generalizedPOAPparse("EDCON1.csv");
  await generalizedPOAPparse("EDCON2.csv");
  //////////////////////ETHBerlinZwei Parser///////////////////////////
  await generalizedPOAPparse("ETHBerlinZwei.csv");
  //////////////////////ETHCapeTown Parser///////////////////////////
  await generalizedPOAPparse("ETHCAPETOWN.csv");
  //////////////////////EthCC Parser///////////////////////////
  await generalizedPOAPparse("EthCC.csv");
  await generalizedPOAPparse("EthCC1.csv");
  await generalizedPOAPparse("EthCC4.csv");
  //////////////////////ETHNewYork Parser///////////////////////////
  await generalizedPOAPparse("ETHNewYork.csv");
  //////////////////////ETHParis Parser///////////////////////////
  await generalizedPOAPparse("ETHParis.csv");
  //////////////////////ETHWaterloo Parser///////////////////////////
  await generalizedPOAPparse("ETHWaterloo.csv");
  /////////////////////////jsonifier and file system saverizor code///////////////////////////
  console.log("JSONifying data");
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].score < 10) {
      accounts[i].score = 30;
    } else if (accounts[i].score > 10 && accounts[i].score < 20) {
      accounts[i].score = 30;
    } else if (accounts[i].score > 20 && accounts[i].score < 30) {
      accounts[i].score = 30;
    } else if (accounts[i].score > 30 && accounts[i].score < 40) {
      accounts[i].score = 40;
    } else if (accounts[i].score > 40 && accounts[i].score < 50) {
      accounts[i].score = 50;
    } else if (accounts[i].score > 50 && accounts[i].score < 60) {
      accounts[i].score = 60;
    } else if (accounts[i].score > 60 && accounts[i].score < 70) {
      accounts[i].score = 70;
    } else if (accounts[i].score > 70 && accounts[i].score < 80) {
      accounts[i].score = 80;
    } else if (accounts[i].score > 80 && accounts[i].score < 90) {
      accounts[i].score = 90;
    } else if (accounts[i].score > 100) {
      accounts[i].score = 100;
    }
  }
  var jsonData = JSON.stringify(accounts, null, 2);
  fs.writeFileSync("./scoreSheets/ScoreSheet.json", jsonData, function (err) {
    res.json({ success: true });
  });
  console.log("Data JSONified into ScoreSheet.json!!!");
  console.log("The current total score is: ");
  console.log(overAllScore);
  console.log("The overall average score is: ");
  console.log(overAllScore / accounts.length);
  console.log("The overall median score is: ");
  console.log(median(scores));
  console.log("the total number of accounts in the final Score Sheet is: ");
  console.log(accounts.length);
  console.log("the total number of accounts parsed over all data sources: ");
  console.log(
    contractDeployerNumberOfAccounts +
      deepDAONumberOfAccounts +
      poapNumberOfAccounts
  );
  console.log("the total number of overlapping accounts is : ");
  console.log(
    contractDeployerNumberOfAccounts +
      deepDAONumberOfAccounts +
      poapNumberOfAccounts -
      accounts.length
  );

  console.log(
    "The total number of accounts in the Contract Deployer data is: "
  );
  console.log(contractDeployerNumberOfAccounts);
  console.log("The total score from the Contract Deployer data is: ");
  console.log(totalScoreContractDeployer);
  console.log("The highest score in the Contract Deployer data is: ");
  console.log(highestContractDeployerScore);
  console.log("The average score for the Contract Deployer data is: ");
  console.log(averageScoreDeployer);
  console.log("The median score for the Contract Deployer data is: ");
  console.log(medianScoreDeployer);

  console.log("The total number of accounts in the DeepDAO data is: ");
  console.log(deepDAONumberOfAccounts);
  console.log("The total score from the DeepDAO data is: ");
  console.log(totalScoreDeepDAO);
  console.log("The highest score in the DeepDAO data is: ");
  console.log(highestDeepDAOscore);
  console.log("The average score for the DeepDAO data is: ");
  console.log(averageScoreDeepDAO);
  console.log("The median score for the DeepDAO data is: ");
  console.log(medianScoreDeepDAO);

  console.log("The total number of accounts in the POAP data is: ");
  console.log(poapNumberOfAccounts);
  console.log("The total score from the POAP data is: ");
  console.log(totalScorePOAP);
  console.log("The highest score in the POAP data is: ");
  console.log(highestPOAPscore);
  console.log("The average score for the POAP data is: ");
  console.log(averageScorePOAP);
  console.log("The median score for the POAP data is: ");
  console.log(medianScorePOAP);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
