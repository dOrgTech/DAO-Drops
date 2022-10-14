import PostMessage from "../models/postMessage.js";
import GetScore from "../models/scores.js";
import Picks from "../models/picks.js";
import Web3Token from "web3-token";
import fetch from "node-fetch";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const body = req.body;
  try {
    const newPost = new PostMessage(body);

    const CAPTHCA_SECRET_KEY = "6Lco_04iAAAAAAWQaU4bb4TDIY4E84ggwqXZey6p";
    const captchaToken = req.headers["captcha-token"];
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTHCA_SECRET_KEY}&response=${captchaToken}`,
      { method: "post" }
    );
    const captchaResponse = await response.json();

    if (captchaResponse.success) {
      try {
        await newPost.save();
        res.status(201).json(newPost);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
    } else {
      res.status(422).json(captchaResponse);
    }
  } catch (error) {
    res.status(420).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  const updatePost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true
  });

  res.json(updatePost);
};

export const getScore = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const token = req.headers["auth"];
    const { address, body } = await Web3Token.verify(token);

    const score = await GetScore.findOne({ account: _id });

    if (
      address.toLowerCase() == score.account.toLowerCase() &&
      body.statement == "This is a signed message"
    ) {
      try {
        res.status(200).json(score);
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    } else {
      res.status(401).json({ message: "Anauthorized User" });
    }
  } catch (error) {
    res.status(420).json({ message: error.message });
  }
};

export const getPicks = async (req, res) => {
  try {
    const picks = await Picks.find();
    res.status(200).json(picks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateScore = async (req, res) => {
  const { id: _id } = req.params;
  const accountData = req.body; // should include:
  // acoount: the eth address of the account being updated
  // score: the updated remaining score of this account
  // message: signed object array
  // object array: an array of objects containing the projects this account has allocated points to as well as how many points each received
  // object ex:
  // {
  //    id: project mongo id,
  //    points: number of points this account allocated to this project
  // }

  const picksArry = accountData.picks;
  const numberofPicks = picksArry.length;
  try {
    const token = accountData.message;
    const { address, body } = await Web3Token.verify(token);
    let updatedPick;
    const updatesScore = await GetScore.findByIdAndUpdate(_id, accountData, {
      new: true
    });

    if (
      address.toLowerCase() == accountData.account.toLowerCase() &&
      body.statement == JSON.stringify(picksArry)
    ) {
      for (let i = 0; i < numberofPicks; i++) {
        const pick = await Picks.findOne({ _id: picksArry[i].id });
        const oldScore = pick.currentScore;
        let newScore = picksArry[i].points + oldScore;
        updatedPick = await Picks.findByIdAndUpdate(
          picksArry[i].id,
          { currentPoints: picksArry[i].points, currentScore: newScore },
          {
            new: true
          }
        );
      }
      res.json(updatedPick);
    } else {
      res.status(401).json({ message: "Anauthorized User" });
    }
  } catch (error) {
    res.status(420).json({ message: error.message });
  }
};
