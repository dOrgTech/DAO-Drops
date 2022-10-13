const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

async function main() {
  console.log("dataminer POAP only starting");
  let accounts = [];
  let overAllScore = 0;
  let scores = [];
  let poapNumberOfAccounts = 0;
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
    rtrim: true
  });

  recordLength = dc1Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc1Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = dc2Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc2Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = dc3Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc3Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = dc4Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc4Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = dc5Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dc5Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = ethBerlinRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBerlinRecords[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = ethBoston1Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBoston1Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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
    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = ethBoston2Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBoston2Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = ethBoston3Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethBoston3Records[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = ethDenverRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethDenverRecords[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );
    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
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
    rtrim: true
  });

  recordLength = ethIndiaRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethIndiaRecords[i]['"Collection"'];

    poapAccount = poapAccount.replace(/"/g, "");
    let existingAccount = accounts.find(
      accountObject => accountObject.account === poapAccount
    );

    let currentAccountScore = 0;

    if (existingAccount === undefined) {
      let accountObject = {
        account: poapAccount,
        score: 1
      };
      accounts.push(accountObject);
      overAllScore++;
      currentAccountScore = 1;
    } else {
      existingAccount.score += 1;
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

    if (currentAccountScore >= 10) {
      numberOfAccountsAbove10++;
    }
    if (currentAccountScore >= 20) {
      numberOfAccountsAbove20++;
    }
    if (currentAccountScore >= 30) {
      numberOfAccountsAbove30++;
    }
    if (currentAccountScore >= 50) {
      numberOfAccountsAbove50++;
    }
    if (currentAccountScore >= 75) {
      numberOfAccountsAbove75++;
    }
    if (currentAccountScore >= 100) {
      numberOfAccountsAbove100++;
    }
    if (currentAccountScore >= 125) {
      numberOfAccountsAbove125++;
    }
    if (currentAccountScore >= 150) {
      numberOfAccountsAbove150++;
    }
    if (currentAccountScore >= 175) {
      numberOfAccountsAbove175++;
    }
    if (currentAccountScore >= 200) {
      numberOfAccountsAbove200++;
    }
  }
  /////////////////////////jsonifier and file system saverizor code///////////////////////////
  console.log("JSONifying data");
  var jsonData = JSON.stringify(accounts, null, 2);
  fs.writeFileSync("./scoreSheets/ScoreSheetPOAP.json", jsonData, function(
    err
  ) {
    res.json({ success: true });
  });
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
  console.log("The total number of accounts with a score less than 10: ");
  console.log(poapNumberOfAccounts - totalAbove10);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
