import PostMessage from "../models/postMessage.js";
import GetScore from "../models/scores.js";
import Picks from "../models/picks.js";
import Web3Token from "web3-token";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

// /**
//  * Allows for all submitted projects to be retrieved
//  * @async
//  * @return {Promise<object>} Returns the list of submitted projects
//  */
// export const getPosts = async (req, res) => {
//   try {
//     const postMessages = await PostMessage.find();
//     res.status(200).json(postMessages);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

/**
 * Allows an end user to submit a project for consideration during phase one
 * @async
 * @param {object} req - request object header is a captcha token, body is object containing submitted project information
 * @return {Promise<object>} Returns the project information
 */
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

/**
 * Allows the front end to retrieve the score of a user by their injected web3 account address
 * @async
 * @param {object} req - request object header is a web3 token, body is a string
 * @return {Promise<object>} Returns an object containing the accounts score
 */
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

/**
 * Allows the front end to retrieve the list of currated projects
 * @async
 * @return {Promise<object>} Returns the currated projects
 */
export const getPicks = async (req, res) => {
  try {
    const picks = await Picks.find();
    res.status(200).json(picks);
  } catch (error) {
    res.status(504).json({ message: error.message });
  }
};

/**
 * Allows an end user to submit their point allocations and updates the scores of projects accordingly
 * @async
 * @param {object} req - request object header is a web3 token, body is account data inluding a lsit of selected projects and how an accounts point are allocated
 * @return {Promise<object>} Returns an object containing the updated project scores
 */
export const updateScore = async (req, res) => {
  const { id: _id } = req.params;
  const accountData = req.body;
  const picksArry = accountData.picks;
  const numberofPicks = picksArry.length;
  let updatedPick;
  let add;
  let bod;
  let submittedUscore = 0;

  try {
    const token = accountData.message;
    const { address, body } = await Web3Token.verify(token);
    add = address.toLowerCase();
    bod = body.statement;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  let accountInfo = await GetScore.findOne({ account: add });
  if (
    add == accountData.account.toLowerCase() &&
    bod == JSON.stringify(picksArry)
  ) {
    for (let i = 0; i < numberofPicks; i++) {
      submittedUscore = parseInt(picksArry[i].points) + submittedUscore;
    }

    if (accountInfo.score != submittedUscore) {
      console.log(accountInfo.score);
      console.log(submittedUscore);

      res
        .status(403)
        .json({ message: "Submitted score doesnt match DB Score for user" });
    } else {
      const updatedScore = await GetScore.findByIdAndUpdate(_id, accountData, {
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
      res.json(updatedScore);
    }
  } else {
    res.status(401).json({ message: "Anauthorized User" });
  }
};
