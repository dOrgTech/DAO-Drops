import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import GetScore from "./models/scores.js";
import PostMessage from "./models/postMessage.js";
import json2csv from "json2csv";
import * as dotenv from "dotenv";

import path from "path";

const __dirname = path.resolve();

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = process.env.ATLAS_URL;

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log("Server running on port:" + PORT))
  )

  .catch(error => console.log(error.message));

const scores = JSON.parse(
  fs.readFileSync(__dirname + "/scoreData/ScoreSheet.json", "utf-8")
);

const importScores = async () => {
  try {
    for (let i = 0; i < scores.length; i++) {
      if (scores[i].score < 10) {
        scores[i].score = 10;
      } else if (scores[i].score > 10 && scores[i].score < 20) {
        scores[i].score = 20;
      } else if (scores[i].score > 20 && scores[i].score < 30) {
        scores[i].score = 30;
      } else if (scores[i].score > 30 && scores[i].score < 40) {
        scores[i].score = 40;
      } else if (scores[i].score > 40 && scores[i].score < 50) {
        scores[i].score = 50;
      } else if (scores[i].score > 50 && scores[i].score < 60) {
        scores[i].score = 60;
      } else if (scores[i].score > 60 && scores[i].score < 70) {
        scores[i].score = 70;
      } else if (scores[i].score > 70 && scores[i].score < 80) {
        scores[i].score = 80;
      } else if (scores[i].score > 80 && scores[i].score < 90) {
        scores[i].score = 90;
      } else if (scores[i].score > 100) {
        scores[i].score = 100;
      }
      scores[i].account = scores[i].account.toLowerCase();
      await GetScore.create(scores[i]);
      console.log("entry added to mongoDB");
      console.log(scores[i]);
    }
    console.log("ScoreSheet Imported to Mongo DB");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const deleteScores = async () => {
  try {
    await GetScore.deleteMany();
    console.log("ScoreSheet deleted from Mongo DB");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const deletePosts = async () => {
  try {
    await PostMessage.deleteMany();
    console.log("ScoreSheet deleted from Mongo DB");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const exportParticipants = async () => {
  try {
    const scoredata = await GetScore.find();
    console.log("Scores exported from Mongo DB");
    let cleanedScores = [];
    const fields = ["address"];
    const opts = { fields };

    for (let i = 0; i < scoredata.length; i++) {
      console.log(scoredata[i].score);
      if (scoredata[i].score == 0) {
        let address = scoredata[i].account;
        let addressOb = {
          address
        };
        cleanedScores.push(addressOb);
      }
    }
    try {
      const csv = json2csv.parse(cleanedScores, opts);
      fs.writeFileSync("exportedAccounts.csv", csv);

      console.log(csv);
    } catch (err) {
      console.error(err);
    }
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const exportVerifiedPoints = async () => {
  try {
    const scoredata = await GetScore.find();
    console.log("Scores exported from Mongo DB");
    let cleanedPointData = [];
    const fields = ["address", "picks", "message"];
    const opts = { fields };

    for (let i = 0; i < scoredata.length; i++) {
      console.log(scoredata[i].score);
      console.log(scoredata[i].picks);
      console.log(scoredata[i].message);
      if (scoredata[i].score == 0) {
        let address = scoredata[i].account;
        let picks = scoredata[i].picks;
        let message = scoredata[i].message;
        let addressOb = {
          address,
          picks,
          message
        };
        cleanedPointData.push(addressOb);
      }
    }
    try {
      const csv = json2csv.parse(cleanedPointData, opts);
      fs.writeFileSync("exportedPointData.csv", csv);

      console.log(csv);
    } catch (err) {
      console.error(err);
    }
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  importScores();
} else if (process.argv[2] === "-d") {
  deleteScores();
} else if (process.argv[2] === "-dp") {
  deletePosts();
} else if (process.argv[2] === "-ep") {
  exportParticipants();
} else if (process.argv[2] === "-evp") {
  exportVerifiedPoints();
}
