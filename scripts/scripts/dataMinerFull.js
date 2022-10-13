const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const median = (arr) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

async function main() {
  console.log("dataminer starting");
  let accounts = [];
  let scores = [];
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

    // Score Normalizastion Code

    if (deploymentCount <= 10) {
      deploymentCount = 10;
    }
    if (deploymentCount > 10 && deploymentCount <= 20) {
      deploymentCount = 20;
    }
    if (deploymentCount > 20 && deploymentCount <= 30) {
      deploymentCount = 30;
    }
    if (deploymentCount > 30 && deploymentCount <= 40) {
      deploymentCount = 40;
    }
    if (deploymentCount > 40 && deploymentCount <= 50) {
      deploymentCount = 50;
    }
    if (deploymentCount > 50 && deploymentCount <= 60) {
      deploymentCount = 60;
    }
    if (deploymentCount > 60 && deploymentCount <= 70) {
      deploymentCount = 70;
    }
    if (deploymentCount > 70 && deploymentCount <= 80) {
      deploymentCount = 80;
    }
    if (deploymentCount > 80 && deploymentCount <= 90) {
      deploymentCount = 90;
    }
    if (deploymentCount > 90) {
      deploymentCount = 100;
    }

    let accountObject = {
      account: deployerAccount,
      score: parseInt(deploymentCount),
    };
    //push new account object to sheet
    accounts.push(accountObject);
    //push score into scores array
    scores.push(parseInt(deploymentCount));
    // push score into deploymentScores array
    deploymentScores.push(parseInt(deploymentCount));
    //add its score to the current overall score
    overAllScore += parseInt(deploymentCount);
    contractDeployerNumberOfAccounts = recordLength;
    totalScoreContractDeployer += parseInt(deploymentCount);
    if (highestContractDeployerScore < parseInt(deploymentCount)) {
      highestContractDeployerScore = parseInt(deploymentCount);
    }
  }
  //calculate average score
  averageScoreDeployer = totalScoreContractDeployer / recordLength;
  // calculate median score
  medianScoreDeployer = median(deploymentScores);

  ///////////////////////////DeepDAO Score parser code///////////////
  console.log("Parsing DeepDAO data");

  const deepDAOFileContent = await fs.readFileSync(
    __dirname + "/csv_src/DeepDAO.csv"
  );

  console.log("Parsing contract deployment data");
  const deepDAOScores = await parse(deepDAOFileContent, {
    columns: true,
    quote: "",
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
    let account = deepDAOScores[i]['"address"'];
    // get the number of contracts trhat account has deployed
    let count = deepDAOScores[i]['"number_of_daos"'];

    console.log("The DeepDAO score for account " + account + " is " + count);

    if (count <= 10) {
      count = 10;
    }
    if (count > 10 && count <= 20) {
      count = 20;
    }
    if (count > 20 && count <= 30) {
      count = 30;
    }
    if (count > 30 && count <= 40) {
      count = 40;
    }
    if (count > 40 && count <= 50) {
      count = 50;
    }
    if (count > 50 && count <= 60) {
      count = 60;
    }
    if (count > 60 && count <= 70) {
      count = 70;
    }
    if (count > 70 && count <= 80) {
      count = 80;
    }
    if (count > 80 && count <= 90) {
      count = 90;
    }
    if (count > 90) {
      count = 100;
    }

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
  console.log("Parsing DevCon 1 data");

  let poapScoresArray = [];

  const dc1FileContent = await fs.readFileSync(
    __dirname + "/csv_src/DevCon1.csv"
  );
  const dc1Records = parse(dc1FileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = dc1Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc1Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 19,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 100;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts = recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  ////////////////////////Devcon2 Parser///////////////////////////
  console.log("Parsing DevCon 2 data");

  const dc2FileContent = await fs.readFileSync(
    __dirname + "/csv_src/DevCon2.csv"
  );
  const dc2Records = parse(dc2FileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = dc2Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc2Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  ////////////////////////Devcon3 Parser///////////////////////////
  console.log("Parsing DevCon 3 data");

  const dc3FileContent = await fs.readFileSync(
    __dirname + "/csv_src/DevCon3.csv"
  );
  const dc3Records = parse(dc3FileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = dc3Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc3Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  ////////////////////////Devcon4 Parser///////////////////////////
  console.log("Parsing DevCon 4 data");

  const dc4FileContent = await fs.readFileSync(
    __dirname + "/csv_src/DevCon4.csv"
  );
  const dc4Records = parse(dc4FileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = dc4Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc4Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  ////////////////////////Devcon5 Parser///////////////////////////
  console.log("Parsing DevCon 5 data");

  const dc5FileContent = await fs.readFileSync(
    __dirname + "/csv_src/DevCon5.csv"
  );
  const dc5Records = parse(dc5FileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = dc5Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc5Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  ////////////////////////ETHBerlin Parser///////////////////////////
  console.log("Parsing ETHBerlin data");

  const ethBerlinFileContent = await fs.readFileSync(
    __dirname + "/csv_src/ETHBerlin.csv"
  );
  const ethBerlinRecords = parse(ethBerlinFileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethBerlinRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBerlinRecords[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  ////////////////////////ETHBerlin2 Parser///////////////////////////
  console.log("Parsing ETHBerlin2 data");

  const ethBerlinFileContent2 = await fs.readFileSync(
    __dirname + "/csv_src/ETHBerlin2.csv"
  );
  const ethBerlinRecords2 = parse(ethBerlinFileContent2, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethBerlinRecords2.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBerlinRecords2[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  ////////////////////////ETHBoston Parser///////////////////////////
  console.log("Parsing ETHBoston data");

  const ethBoston1FileContent = await fs.readFileSync(
    __dirname + "/csv_src/ETHBOSTON1.csv"
  );
  const ethBoston1Records = parse(ethBoston1FileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethBoston1Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBoston1Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  const ethBoston2FileContent = await fs.readFileSync(
    __dirname + "/csv_src/ETHBOSTON2.csv"
  );
  const ethBoston2Records = parse(ethBoston2FileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethBoston2Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBoston2Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }

  const ethBoston3FileContent = await fs.readFileSync(
    __dirname + "/csv_src/ETHBOSTON3.csv"
  );
  const ethBoston3Records = parse(ethBoston3FileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethBoston3Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBoston3Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }
  ////////////////////////ETHDenver Parser///////////////////////////
  console.log("Parsing ETHDenver data");

  const ethDenverFileContent = await fs.readFileSync(
    __dirname + "/csv_src/ETHDenver.csv"
  );
  const ethDenverRecords = parse(ethDenverFileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethDenverRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethDenverRecords[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }
  //////////////////////ETHIndia Parser///////////////////////////
  console.log("Parsing ETHIndia data");

  const ethIndiaFileContent = await fs.readFileSync(
    __dirname + "/csv_src/ETHIndia.csv"
  );
  const ethIndiaRecords = parse(ethIndiaFileContent, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethIndiaRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethIndiaRecords[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }
  //////////////////////ETHIndia2 Parser///////////////////////////
  console.log("Parsing ETHIndia2 data");

  const ethIndiaFileContent2 = await fs.readFileSync(
    __dirname + "/csv_src/ETHIndia2.csv"
  );
  const ethIndiaRecords2 = parse(ethIndiaFileContent2, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethIndiaRecords2.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethIndiaRecords2[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      (accountObject) => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 10,
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 10;
    } else {
      existingAccount.score += 10;
      overAllScore++;
      currentAccountScore = existingAccount.score;
    }
    //push score into scores array
    scores.push(currentAccountScore);
    // push score into poapScoresArray array
    poapScoresArray.push(currentAccountScore);
    //track overall data for scoring adjustments
    poapNumberOfAccounts += recordLength;
    totalScorePOAP += parseInt(currentAccountScore);
    if (highestPOAPscore < parseInt(currentAccountScore)) {
      highestPOAPscore = parseInt(currentAccountScore);
    }
  }
  //calculate average score
  averageScorePOAP = totalScorePOAP / poapNumberOfAccounts;
  // calculate median score
  medianScorePOAP = median(poapScoresArray);
  /////////////////////////jsonifier and file system saverizor code///////////////////////////
  console.log("JSONifying data");
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
