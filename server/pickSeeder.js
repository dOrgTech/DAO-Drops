import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import Picks from "./models/picks.js";
import path from "path";
import json2csv from "json2csv";

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

const picks = JSON.parse(
  fs.readFileSync(__dirname + "/pickData/Picks.json", "utf-8")
);

const importPicks = async () => {
  try {
    for (let i = 0; i < picks.length; i++) {
      await Picks.create(picks[i]);
      console.log("entry added to mongoDB");
      console.log(picks[i]);
    }
    console.log("Picks Imported to Mongo DB");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const deletePicks = async () => {
  try {
    await Picks.deleteMany();
    console.log("Picks deleted from Mongo DB");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const exportPicks = async () => {
  try {
    const picksdata = await Picks.find();
    console.log("Picks exported from Mongo DB");
    let cleanedPicks = [];
    const fields = [
      "projectName",
      "projectDescription",
      "website",
      "address",
      "contact",
      "contactMethod"
    ];
    const opts = { fields };

    for (let i = 0; i < picksdata.length; i++) {
      let projectName = picksdata[i].projectName;
      let projectDescription = picksdata[i].projectDescription;
      let website = picksdata[i].website;
      let address = picksdata[i].address;
      let contact = picksdata[i].contact;
      let contactMethod = picksdata[i].contactMethod;

      let indiPick = {
        projectName,
        projectDescription,
        website,
        address,
        contact,
        contactMethod
      };
      cleanedPicks.push(indiPick);
    }
    try {
      const csv = json2csv.parse(cleanedPicks, opts);
      fs.writeFileSync("exportedPicks.csv", csv);

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
  importPicks();
} else if (process.argv[2] === "-d") {
  deletePicks();
} else if (process.argv[2] === "-e") {
  exportPicks();
}
