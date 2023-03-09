const fs = require("fs");
const parse = require("csv-parse/lib/sync");

let accounts = [];
let overAllScore = 0;
let scores = [];
let poapNumberOfAccounts = 0;
let poapScoresArray = [];
let totalScorePOAP = 0;
let highestPOAPscore = 0;
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

  accountsLength = accounts.length;
  for (let i = 0; i < accountsLength; i++) {
    if (accounts[i].score >= 10) {
      numberOfAccountsAbove10++;
    }
    if (accounts[i].score >= 20) {
      numberOfAccountsAbove20++;
    }
    if (accounts[i].score >= 30) {
      numberOfAccountsAbove30++;
    }
    if (accounts[i].score >= 50) {
      numberOfAccountsAbove50++;
    }
    if (accounts[i].score >= 75) {
      numberOfAccountsAbove75++;
    }
    if (accounts[i].score >= 100) {
      numberOfAccountsAbove100++;
    }
    if (accounts[i].score >= 125) {
      numberOfAccountsAbove125++;
    }
    if (accounts[i].score >= 150) {
      numberOfAccountsAbove150++;
    }
    if (accounts[i].score >= 175) {
      numberOfAccountsAbove175++;
    }
    if (accounts[i].score >= 200) {
      numberOfAccountsAbove200++;
    }
  }
};

async function main() {
  console.log("dataminer POAP only starting");
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
  var jsonData = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(
    "./scoreSheets/ScoreSheetPOAP.json",
    jsonData,
    function (err) {
      res.json({ success: true });
    }
  );
  console.log("Data JSONified into ScoreSheet.json!!!");
  console.log("The total number of accounts in the POAP data is: ");
  console.log(poapNumberOfAccounts);
  console.log("The total score from the POAP data is: ");
  console.log(totalScorePOAP);
  console.log("The highest score in the POAP data is: ");
  console.log(highestPOAPscore);
  console.log("The average score for the POAP data is: ");
  console.log(overAllScore / accounts.length);
  console.log("The median score for the POAP data is: ");
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
