import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import GetScore from "./models/scores.js";

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
  fs.readFileSync(
    "scoreData/SS.json",
    // "scoreData/ScoreSheet.json",
    "utf-8"
  )
);

const importScores = async () => {
  try {
    for (let i = 0; i < scores.length; i++) {
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

if (process.argv[2] === "-i") {
  importScores();
} else if (process.argv[2] === "-d") {
  deleteScores();
}
