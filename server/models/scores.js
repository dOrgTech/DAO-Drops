import mongoose from "mongoose";

const scoreSchema = mongoose.Schema({
  account: String,
  score: Number,
  picks: Array //array of objects containing project points added to and how many points where added
});

const GetScore = mongoose.model("GetScore", scoreSchema);

export default GetScore;
