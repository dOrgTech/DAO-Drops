import mongoose from "mongoose";

const picksSchema = mongoose.Schema({
  projectName: String,
  projectDescription: String,
  website: String,
  address: String,
  currentPoints: String,
  icon: String,
  contact: String,
  contactMethod: String
});

const Picks = mongoose.model("Picks", picksSchema);

export default Picks;
