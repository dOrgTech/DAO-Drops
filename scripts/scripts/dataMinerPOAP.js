const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const median = (arr) => {
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
  //////////////////////ETHDenver Parser///////////////////////////

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

  //////////////////////ETHIndia3 Parser///////////////////////////
  console.log("Parsing ETHIndia3 data");

  const ethIndiaFileContent3 = await fs.readFileSync(
    __dirname + "/csv_src/ETHIndia3.csv"
  );
  const ethIndiaRecords3 = parse(ethIndiaFileContent3, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethIndiaRecords3.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethIndiaRecords3[i]['"Collection"'];

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

  //////////////////////Dappcon 2019 Parser///////////////////////////
  console.log("Parsing Dappcon 2019 data");

  const dappCon19File = await fs.readFileSync(
    __dirname + "/csv_src/Dappcon_2019.csv"
  );
  const dappCon19Records = parse(dappCon19File, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = dappCon19Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dappCon19Records[i]['"Collection"'];

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

  //////////////////////Dappcon 2019 Parser///////////////////////////
  console.log("Parsing Dappcon  data");

  const dappConFile = await fs.readFileSync(__dirname + "/csv_src/DappCon.csv");
  const dappConRecords = parse(dappConFile, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = dappConRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = dappConRecords[i]['"Collection"'];

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

  ////////////////////DevCon Bogota Parser///////////////////////////
  console.log("Parsing DevCon Bogota data");

  const devcon_bogotaFile = await fs.readFileSync(
    __dirname + "/csv_src/Devcon_Bogota.csv"
  );
  const devcon_bogotaRecords = parse(devcon_bogotaFile, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = devcon_bogotaRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = devcon_bogotaRecords[i]['"Collection"'];

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

  //////////////////////EDCON 1 Parser///////////////////////////
  console.log("Parsing EDCON 1 data");

  const edcon1File = await fs.readFileSync(__dirname + "/csv_src/EDCON1.csv");
  const edcon1Records = parse(edcon1File, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = edcon1Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = edcon1Records[i]['"Collection"'];

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

  ////////////////////EDCON 2 Parser///////////////////////////
  console.log("Parsing EDCON 2 data");

  const edcon2File = await fs.readFileSync(__dirname + "/csv_src/EDCON2.csv");
  const edcon2Records = parse(edcon2File, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = edcon2Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = edcon2Records[i]['"Collection"'];

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

  //////////////////////ETHBerlinZwei Parser///////////////////////////
  console.log("Parsing ETHBerlinZwei data");

  const ebzwFile = await fs.readFileSync(
    __dirname + "/csv_src/ETHBerlinZwei.csv"
  );
  const ebzwRecords = parse(ebzwFile, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ebzwRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ebzwRecords[i]['"Collection"'];

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

  //////////////////////ETHCapeTown Parser///////////////////////////
  console.log("Parsing ETHCapeTown data");

  const ectFile = await fs.readFileSync(__dirname + "/csv_src/ETHCAPETOWN.csv");
  const ectRecords = parse(ectFile, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ectRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ectRecords[i]['"Collection"'];

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

  //////////////////////EthCC Parser///////////////////////////
  console.log("Parsing EthCC data");

  const ethccFile = await fs.readFileSync(__dirname + "/csv_src/EthCC.csv");
  const ethccRecords = parse(ethccFile, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethccRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethccRecords[i]['"Collection"'];

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

  //////////////////////EthCC1 Parser///////////////////////////
  console.log("Parsing EthCC1 data");

  const ethcc1File = await fs.readFileSync(__dirname + "/csv_src/EthCC1.csv");
  const ethcc1Records = parse(ethcc1File, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethcc1Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethcc1Records[i]['"Collection"'];

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

  ////////////////////EthCC4 Parser///////////////////////////
  console.log("Parsing EthCC4 data");

  const ethcc4File = await fs.readFileSync(__dirname + "/csv_src/EthCC4.csv");
  const ethcc4Records = parse(ethcc4File, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ethcc4Records.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ethcc4Records[i]['"Collection"'];

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

  //////////////////////ETHNewYork Parser///////////////////////////
  console.log("Parsing ETHNewYork data");

  const enyFile = await fs.readFileSync(__dirname + "/csv_src/ETHNewYork.csv");
  const enyRecords = parse(enyFile, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = enyRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = enyRecords[i]['"Collection"'];

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

  //////////////////////ETHParis Parser///////////////////////////
  console.log("Parsing ETHParis data");

  const epFile = await fs.readFileSync(__dirname + "/csv_src/ETHParis.csv");
  const epRecords = parse(epFile, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = epRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = epRecords[i]['"Collection"'];

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

  //////////////////////ETHWaterloo Parser///////////////////////////
  console.log("Parsing ETHWaterloo data");

  const ewFile = await fs.readFileSync(__dirname + "/csv_src/ETHWaterloo.csv");
  const ewRecords = parse(ewFile, {
    columns: true,
    quote: "",
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  });

  recordLength = ewRecords.length;
  for (let i = 0; i < recordLength; i++) {
    let poapAccount = ewRecords[i]['"Collection"'];

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
