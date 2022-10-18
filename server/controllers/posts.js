import PostMessage from "../models/postMessage.js";
import GetScore from "../models/scores.js";
import Picks from "../models/picks.js";
import Web3Token from "web3-token";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

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

    const captchaToken = req.headers["captcha-token"];
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTHCA_SECRET_KEY}&response=${captchaToken}`,
      { method: "post" }
    );
    const captchaResponse = await response.json();

    if (captchaResponse.success) {
      try {
        await newPost.save();
        res.status(201).json(newPost);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(422).json(captchaResponse);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(401).json({ message: "Anauthorized User" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPicks = async (req, res) => {
  try {
    const picks = await Picks.find();
    res.status(200).json(picks);
  } catch (error) {
    res.status(504).json({ message: error.message });
  }
};

export const updateScore = async (req, res) => {
  const { id: _id } = req.params;
  const accountData = req.body;
  const picksArry = accountData.picks;
  const numberofPicks = picksArry.length;
  let updatedPick;
  let add;
  let bod;

  try {
    const token = accountData.message;
    const { address, body } = await Web3Token.verify(token);
    add = address.toLowerCase();
    bod = body.statement;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  if (
    add == accountData.account.toLowerCase() &&
    bod == JSON.stringify(picksArry)
  ) {
    const updatesScore = await GetScore.findByIdAndUpdate(_id, accountData, {
      new: true
    });
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
};
