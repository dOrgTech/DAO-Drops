import mongoose from "mongoose";

const picksSchema = mongoose.Schema({
  projectName: String,
  projectDescription: String,
  website: String,
  address: String,
  icon: String,
  contact: String,
  currentPoints: Array
});

const Picks = mongoose.model("Picks", picksSchema);

export default Picks;
