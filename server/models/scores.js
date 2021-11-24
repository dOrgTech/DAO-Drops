import mongoose from "mongoose";

const scoreSchema = mongoose.Schema({
  account: String,
  score: String
});

const GetScore = mongoose.model("GetScore", scoreSchema);

export default GetScore;
