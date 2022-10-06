import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import GetScore from "./models/scores.js";
import PostMessage from "./models/postMessage.js";

import path from "path";

const __dirname = path.resolve();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL =
  "mongodb+srv://DAOdropsApp:PEGEl0PVqFQobYce@cluster0.xp7yw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log("Server running on port:" + PORT))
  )

  .catch(error => console.log(error.message));

const scores = JSON.parse(
  fs.readFileSync(__dirname + "/scoreData/SS.json", "utf-8")
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

if (process.argv[2] === "-i") {
  importScores();
} else if (process.argv[2] === "-d") {
  deleteScores();
} else if (process.argv[2] === "-dp") {
  deletePosts();
}
